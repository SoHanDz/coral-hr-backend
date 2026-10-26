import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmployeeStatus } from '../employee.entity.js';

// DTO tạo mới nhân viên
export class CreateEmployeeDto {
  @IsString()
  @MaxLength(150)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  departmentId?: number;
}
