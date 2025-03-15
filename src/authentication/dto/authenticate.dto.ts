import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
