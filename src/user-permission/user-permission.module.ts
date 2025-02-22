import { Module } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './user-permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission])],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService, TypeOrmModule.forFeature([UserPermission])],
})
export class UserPermissionModule {}
