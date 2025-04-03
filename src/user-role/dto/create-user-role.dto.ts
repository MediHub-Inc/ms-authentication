import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsNotEmpty()
  permissions!: string[];

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
