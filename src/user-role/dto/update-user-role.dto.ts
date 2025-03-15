import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRoleDto } from './create-user-role.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  @IsArray()
  @IsNotEmpty()
  permissions!: string[];
}
