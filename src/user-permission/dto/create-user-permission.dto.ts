import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUserPermissionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
