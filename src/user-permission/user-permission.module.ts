import { Module } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { UserPermission, UserPermissionSchema } from './user-permission.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPermission.name, schema: UserPermissionSchema },
    ]),
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService],
})
export class UserPermissionModule {}
