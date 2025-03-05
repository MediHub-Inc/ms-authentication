/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationCode } from '../authentication/authentication.model';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.model';
import { JWT_EXPIRATION_TIME, verifyToken } from '../utils/helpers/jwt.helper';
import { GrantType } from '../utils/enums/grant-type.enum';
import { User } from 'src/user/user.model';
import { UserStatus } from 'src/utils/enums/user-status.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AuthenticationCode)
    private authenticationRepository: Repository<AuthenticationCode>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.privateKey = Buffer.from(
      this.configService.get<string>('JWT_SIGNING_PRIVATE_KEY_BASE64') || '',
      'base64',
    ).toString('utf-8');
    this.publicKey = Buffer.from(
      this.configService.get<string>('JWT_PUBLIC_KEY_BASE64') || '',
      'base64',
    )
      .toString('utf-8')
      .trim();
  }

  /**
   * ✅ Intercambiar un authenticationCode por un accessToken + refreshToken
   */
  async exchangeCodeForToken(authenticationCode: string, grantType: GrantType) {
    const authCode = await this.authenticationRepository.findOne({
      where: { code: authenticationCode },
      relations: ['user'],
    });

    if (!authCode) {
      throw new NotFoundException('Invalid authentication code');
    }

    if (authCode.grantType !== grantType) {
      throw new BadRequestException(
        `Invalid grantType: expected ${authCode.grantType}, received ${grantType}`,
      );
    }

    const accessToken = await this.generateAccessToken(authCode.user);
    const refreshToken = await this.generateRefreshToken(authCode.user);

    // ✅ Guardar el nuevo Refresh Token en la base de datos
    await this.refreshTokenRepository.save({
      token: refreshToken,
      user: authCode.user,
      expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN, // 7 días en segundos
      expiresAt: new Date(
        Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000,
      ), // 📅 Fecha exacta
    });

    // ❗ Eliminar el authenticationCode ya usado
    await this.authenticationRepository.delete({ code: authenticationCode });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(user: User) {
    return this.jwtService.sign(
      { userId: user.id },
      {
        privateKey: this.privateKey,
        expiresIn: this.configService.get<string>('JWT_EXPIRE') || '1h',
        algorithm: 'RS256',
      },
    );
  }

  async generateRefreshToken(user: User) {
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      {
        privateKey: this.privateKey,
        expiresIn: '7d', // Configurable en .env
        algorithm: 'RS256',
      },
    );

    return refreshToken;
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  async validateRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return refreshToken.user;
  }

  /**
   * ✅ Refrescar un token usando el refreshToken
   */
  async refreshToken(oldRefreshToken: string, grantType: GrantType) {
    // 🚨 Verificar la validez del refresh token
    if (grantType !== 'refresh_token') {
      throw new BadRequestException(
        `Invalid grantType: expected "refresh_token", received "${grantType}"`,
      );
    }
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(oldRefreshToken, {
        secret: this.publicKey,
        algorithms: ['RS256'],
      });

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // 🚨 Buscar el refresh token en la base de datos
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
      relations: ['user'],
    });

    if (!existingToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // ⏳ Si el token ha expirado, eliminarlo
    if (new Date() > existingToken.expiresAt) {
      await this.refreshTokenRepository.delete(existingToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // 🚨 Si el token ya fue revocado, rechazarlo
    if (existingToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has already been used.');
    }

    // 🚨 Si el refresh token ya se usó una vez, evitar su reutilización
    if (existingToken.refreshCount >= 1) {
      await this.refreshTokenRepository.update(existingToken.id, {
        revokedAt: new Date(),
      });
      throw new UnauthorizedException(
        'Refresh token already used. Please log in again.',
      );
    }

    // 🛑 Revocar el refresh token inmediatamente (One-Time Usage)
    await this.refreshTokenRepository.update(existingToken.id, {
      revokedAt: new Date(),
      refreshCount: existingToken.refreshCount + 1, // Incrementar el uso
    });

    // ✅ Generar solo un nuevo **Access Token**, pero NO un nuevo Refresh Token
    const newAccessToken = await this.generateAccessToken(existingToken.user);

    return { accessToken: newAccessToken };
  }

  async validateAndRevokeRefreshToken(refreshToken: string) {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!existingToken) return null;

    // ⏳ Si el token ha expirado
    if (new Date() > existingToken.expiresAt) {
      await this.refreshTokenRepository.update(existingToken.id, {
        revokedAt: new Date(),
      });
      return null;
    }

    // 🚨 Si el token ya fue revocado, es un intento de reutilización
    if (existingToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    // 🛑 Revocar el token actual antes de emitir uno nuevo
    await this.refreshTokenRepository.update(existingToken.id, {
      revokedAt: new Date(),
    });

    return existingToken;
  }

  // async generateNewTokens(userId: string) {
  //   // 🔐 Generar nuevo Access Token
  //   const newAccessToken = generateAccessToken(userId);

  //   // 🔐 Generar nuevo Refresh Token
  //   const newRefreshToken = generateRefreshToken(userId);

  //   // 💾 Guardar el nuevo Refresh Token en la base de datos
  //   const savedRefreshToken = await this.refreshTokenRepository.save({
  //     token: newRefreshToken,
  //     user: { id: userId }, // Asociar el token con el usuario
  //     expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN, // Tiempo de vida en segundos
  //     expiresAt: new Date(
  //       Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000,
  //     ),
  //   });

  //   return {
  //     accessToken: newAccessToken,
  //     refreshToken: savedRefreshToken.token,
  //   };
  // }

  /**
   * ✅ Valida el token JWT y retorna el usuario autenticado
   */
  async validateToken(token: string): Promise<User> {
    try {
      // 🔑 Verificar y decodificar el token
      const decoded = verifyToken(token);

      if (!decoded.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // 🔍 Buscar el usuario en la base de datos
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId, status: UserStatus.ACTIVE },
      });

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
