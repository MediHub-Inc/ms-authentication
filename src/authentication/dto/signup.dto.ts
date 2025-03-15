import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsUrl,
  Matches,
  MinLength,
  MaxLength,
  IsOptional,
  Equals,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserStatus } from '../../utils/enums/user-status.enum';

export class SignUpDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  familyName!: string;

  @ApiProperty({ example: 'Michael', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  middleName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email!: string;

  @ApiProperty({
    example: UserStatus.ACTIVE, // Usa un valor del enum
    enum: UserStatus, // Enum en Swagger
    description: 'User status must be ACTIVE, DISABLED, or ARCHIVED',
  })
  @IsEnum(UserStatus, {
    message: 'Status must be either ACTIVE, DISABLED, or ARCHIVED',
  })
  status!: UserStatus;

  @ApiProperty({ example: '+51999888777' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g. +51999888777)',
  })
  phoneNumber!: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Transform(({ value }) => value?.toLowerCase())
  username!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({ example: 'P@ssword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password!: string;

  @ApiProperty({ example: 'P@ssword123!' })
  @IsString()
  @Equals('password', {
    message: 'Passwords do not match',
  })
  confirmPassword!: string;

  @ApiProperty({ example: '5a3e2f97-67cd-4b12-a3c6-f2e2d0b6c93b' })
  @IsUUID()
  role!: string;
}
