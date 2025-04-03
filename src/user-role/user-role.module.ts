import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { UserRole, UserRoleSchema } from './user-role.schema';
import {
  UserPermission,
  UserPermissionSchema,
} from '../user-permission/user-permission.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
      { name: UserPermission.name, schema: UserPermissionSchema },
    ]),
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
