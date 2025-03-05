import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationCode } from './authentication.model';
import { UserCredential } from '../user-credential/user-credential.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.model';
import { Organization } from '../organization/organization.model';
import { UserRole } from '../user-role/user-role.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthenticationCode,
      UserCredential,
      User,
      Organization,
      UserRole,
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
