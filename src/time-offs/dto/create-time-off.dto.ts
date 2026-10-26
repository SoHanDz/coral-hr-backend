import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TimeOffStatus } from '../time-off.entity.js';

// DTO tạo mới đơn xin nghỉ phép
export class CreateTimeOffDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(TimeOffStatus)
  status?: TimeOffStatus;
}
