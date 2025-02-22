import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from '../../utils/enums/user-role.enum';
import { UserStatus } from '../../utils/enums/user-status.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  givenName: string;

  @IsNotEmpty()
  @IsString()
  familyName: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNotEmpty()
  @IsNumber()
  organizationId: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
