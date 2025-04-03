import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.schema';
import {
  AuthenticationCode,
  AuthenticationCodeSchema,
} from '../authentication/authentication-code.schema';
import { User, UserSchema } from '../user/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: AuthenticationCode.name, schema: AuthenticationCodeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtStrategy, PassportModule],
})
export class TokenModule {}
