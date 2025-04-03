import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import {
  AuthenticationCode,
  AuthenticationCodeSchema,
} from './authentication-code.schema';
import {
  UserCredential,
  UserCredentialSchema,
} from '../user-credential/user-credential.schema';
import { User, UserSchema } from '../user/user.schema';
import {
  Organization,
  OrganizationSchema,
} from '../organization/organization.schema';
import { UserRole, UserRoleSchema } from '../user-role/user-role.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthenticationCode.name, schema: AuthenticationCodeSchema },
      { name: User.name, schema: UserSchema },
      { name: UserCredential.name, schema: UserCredentialSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
