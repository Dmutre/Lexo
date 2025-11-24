import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
