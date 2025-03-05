import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { RefreshToken } from './refresh-token.model';
import { AuthenticationCode } from '../authentication/authentication.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthenticationCode, RefreshToken, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtStrategy, PassportModule],
})
export class TokenModule {}
