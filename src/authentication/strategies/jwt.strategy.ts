import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log('🔎 Cookie Access Token:', request?.cookies?.accessToken);
          if (request?.cookies?.accessToken) {
            return request?.cookies?.accessToken;
          } // 🛑 Extraer desde la cookie
          else {
            return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get<string>('JWT_PUBLIC_KEY_BASE64') || '',
        'base64',
      ).toString('utf-8'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { userId: string }) {
    console.log('Decoded JWT Payload:', payload);
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { id: payload.userId };
  }
}
