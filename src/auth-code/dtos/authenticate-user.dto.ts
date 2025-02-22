import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
