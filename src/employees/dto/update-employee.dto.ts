import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto.js';

// DTO cập nhật nhân viên - tất cả field đều optional
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
