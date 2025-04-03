import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationCode } from '../authentication/authentication-code.schema';
import { RefreshToken } from './refresh-token.schema';
import { JWT_EXPIRATION_TIME, verifyToken } from '../utils/helpers/jwt.helper';
import { GrantType } from '../utils/enums/grant-type.enum';
import { User } from '../user/user.schema';
import { UserStatus } from '../utils/enums/user-status.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(AuthenticationCode.name)
    private readonly authenticationModel: Model<AuthenticationCode>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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

  async exchangeCodeForToken(authenticationCode: string, grantType: GrantType) {
    const authCode = await this.authenticationModel
      .findOne({ code: authenticationCode })
      .populate<{ user: User }>('user');

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

    await this.refreshTokenModel.create({
      token: refreshToken,
      user: authCode.user._id,
      expiresIn: JWT_EXPIRATION_TIME.REFRESH_TOKEN,
      expiresAt: new Date(
        Date.now() + JWT_EXPIRATION_TIME.REFRESH_TOKEN * 1000,
      ),
    });

    await this.authenticationModel.deleteOne({ code: authenticationCode });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(user: User) {
    return this.jwtService.sign(
      { userId: user._id },
      {
        privateKey: this.privateKey,
        expiresIn: this.configService.get<string>('JWT_EXPIRE') || '1h',
        algorithm: 'RS256',
      },
    );
  }

  async generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { userId: user._id },
      {
        privateKey: this.privateKey,
        expiresIn: '7d',
        algorithm: 'RS256',
      },
    );
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({
      _id: userId,
      status: UserStatus.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async validateRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await this.refreshTokenModel
      .findOne({ token })
      .populate<{ user: User }>('user');

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return refreshToken.user;
  }

  async refreshToken(oldRefreshToken: string, grantType: GrantType) {
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

    const existingToken = await this.refreshTokenModel
      .findOne({ token: oldRefreshToken })
      .populate<{ user: User }>('user');

    if (!existingToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (new Date() > existingToken.expiresAt) {
      await this.refreshTokenModel.deleteOne({ _id: existingToken._id });
      throw new UnauthorizedException('Refresh token expired');
    }

    if (existingToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has already been used.');
    }

    if (existingToken.refreshCount >= 1) {
      await this.refreshTokenModel.updateOne(
        { _id: existingToken._id },
        { revokedAt: new Date() },
      );
      throw new UnauthorizedException(
        'Refresh token already used. Please log in again.',
      );
    }

    await this.refreshTokenModel.updateOne(
      { _id: existingToken._id },
      {
        revokedAt: new Date(),
        refreshCount: existingToken.refreshCount + 1,
      },
    );

    const newAccessToken = await this.generateAccessToken(existingToken.user);
    return { accessToken: newAccessToken };
  }

  async validateAndRevokeRefreshToken(refreshToken: string) {
    const existingToken = await this.refreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!existingToken) return null;

    if (new Date() > existingToken.expiresAt) {
      await this.refreshTokenModel.updateOne(
        { _id: existingToken._id },
        { revokedAt: new Date() },
      );
      return null;
    }

    if (existingToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    await this.refreshTokenModel.updateOne(
      { _id: existingToken._id },
      { revokedAt: new Date() },
    );

    return existingToken;
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = verifyToken(token);

      if (!decoded.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userModel.findOne({
        _id: decoded.userId,
        status: UserStatus.ACTIVE,
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
