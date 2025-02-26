import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { RefreshToken } from './refresh-token.model';
import { AuthenticationCode } from '../authentication/authentication.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.model';
@Module({
  imports: [TypeOrmModule.forFeature([AuthenticationCode, RefreshToken, User])],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
