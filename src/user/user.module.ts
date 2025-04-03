import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRole, UserRoleSchema } from '../user-role/user-role.schema';
import {
  Organization,
  OrganizationSchema,
} from '../organization/organization.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserCredentialModule } from '../user-credential/user-credential.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    UserCredentialModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
