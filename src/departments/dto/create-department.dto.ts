import { IsOptional, IsString, MaxLength } from 'class-validator';

// DTO tạo mới phòng ban
export class CreateDepartmentDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
