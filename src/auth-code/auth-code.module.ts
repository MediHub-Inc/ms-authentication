import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { UserModule } from '../user/user.module';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { UserService } from '../user/user.service';
import { AuthCodeController } from './auth-code.controller';
import { AuthCode } from './auth-code.model';
import { AuthCodeService } from './auth-code.service';
import { BusinessService } from '../business/business.service';
import { BusinessModule } from 'src/business/business.module';
import { AuthenticationCodes } from './authentication-codes.model';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthCode, AuthenticationCodes]),
    UserModule,
    UserCredentialModule,
    BusinessModule,
  ],
  controllers: [AuthCodeController],
  providers: [
    AuthCodeService,
    UserService,
    UserCredentialService,
    BusinessService,
    RefreshTokenService,
  ],
  exports: [
    AuthCodeService,
    TypeOrmModule.forFeature([AuthCode, AuthenticationCodes]),
  ],
})
export class AuthCodeModule {}
