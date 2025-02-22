import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UserRole } from 'src/user-role/user-role.model';
import { Business } from 'src/business/business.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Business])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
