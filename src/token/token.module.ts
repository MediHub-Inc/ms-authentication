import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { RefreshToken } from './refresh-token.model';
import { AuthenticationCode } from 'src/authentication/authentication.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthenticationCode, RefreshToken])],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
