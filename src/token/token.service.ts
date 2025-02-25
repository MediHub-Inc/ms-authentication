import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationCode } from '../authentication/authentication.model';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.model';
import { generateAccessToken, generateRefreshToken, JWT_EXPIRATION_TIME } from '../utils/helpers/jwt.helper';
import { GrantType } from '../utils/enums/grant-type.enum';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(AuthenticationCode)
    private authenticationRepository: Repository<AuthenticationCode>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) { }

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
      throw new BadRequestException(`Invalid grantType: expected ${authCode.grantType}, received ${grantType}`);
    }

    const accessToken = generateAccessToken(authCode.user.id);
    const refreshToken = generateRefreshToken(authCode.user.id);

    // ✅ Guardar el nuevo Refresh Token en la base de datos
    await this.refreshTokenRepository.save({
      token: refreshToken,
      user: authCode.user,
      expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN, // 7 días en segundos
      expiresAt: new Date(Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000), // 📅 Fecha exacta
    });

    // ❗ Eliminar el authenticationCode ya usado
    await this.authenticationRepository.delete({ code: authenticationCode });

    return { accessToken, refreshToken };
  }

  /**
   * ✅ Refrescar un token usando el refreshToken
   */
  async refreshToken(oldRefreshToken: string, grantType: GrantType) {
    if (grantType !== 'refresh_token') {
      throw new BadRequestException(`Invalid grantType: expected "refresh_token", received "${grantType}"`);
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new NotFoundException('Invalid refresh token');
    }

    // ⏳ Si el token ha expirado
    if (new Date() > refreshToken.expiresAt) {
      // 🚨 Revocar el token en la base de datos
      await this.refreshTokenRepository.update(refreshToken.id, { revokedAt: new Date() });

      throw new UnauthorizedException('Refresh token expired. Please log in again.');
    }

    // 🛑 Si el token ya fue revocado previamente
    if (refreshToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }
    console.log('🔑 refreshToken', refreshToken);
    // ✅ Generar un nuevo Access Token y Refresh Token
    const newAccessToken = generateAccessToken(refreshToken.user.id);
    const newRefreshToken = generateRefreshToken(refreshToken.user.id);

    // 🗑️ Revocar el refresh token anterior
    await this.refreshTokenRepository.update(refreshToken.id, { revokedAt: new Date() });

    // 💾 Guardar el nuevo refresh token
    await this.refreshTokenRepository.save({
      token: newRefreshToken,
      user: refreshToken.user,
      expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN,
      expiresAt: new Date(Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async validateAndRevokeRefreshToken(refreshToken: string) {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!existingToken) return null;

    // ⏳ Si el token ha expirado
    if (new Date() > existingToken.expiresAt) {
      await this.refreshTokenRepository.update(existingToken.id, { revokedAt: new Date() });
      return null;
    }

    // 🚨 Si el token ya fue revocado, es un intento de reutilización
    if (existingToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    // 🛑 Revocar el token actual antes de emitir uno nuevo
    await this.refreshTokenRepository.update(existingToken.id, { revokedAt: new Date() });

    return existingToken;
  }

  async generateNewTokens(userId: string) {
    // 🔐 Generar nuevo Access Token
    const newAccessToken = generateAccessToken(userId);

    // 🔐 Generar nuevo Refresh Token
    const newRefreshToken = generateRefreshToken(userId);

    // 💾 Guardar el nuevo Refresh Token en la base de datos
    const savedRefreshToken = await this.refreshTokenRepository.save({
      token: newRefreshToken,
      user: { id: userId }, // Asociar el token con el usuario
      expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN, // Tiempo de vida en segundos
      expiresAt: new Date(Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: savedRefreshToken.token
    };
  }


}
