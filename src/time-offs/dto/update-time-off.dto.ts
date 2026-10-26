import { PartialType } from '@nestjs/swagger';
import { CreateTimeOffDto } from './create-time-off.dto.js';

// DTO cập nhật đơn xin nghỉ phép - tất cả field đều optional
export class UpdateTimeOffDto extends PartialType(CreateTimeOffDto) {}
