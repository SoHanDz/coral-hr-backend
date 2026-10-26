import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO đăng nhập
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
