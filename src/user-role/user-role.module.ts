import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user-role.model';
import { UserPermission } from 'src/user-permission/user-permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, UserPermission])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
})
export class UserRoleModule {}
