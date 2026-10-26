import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto.js';

// DTO cập nhật phòng ban - tất cả field đều optional
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
