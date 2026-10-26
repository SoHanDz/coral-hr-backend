import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeOff } from './time-off.entity.js';
import { CreateTimeOffDto } from './dto/create-time-off.dto.js';
import { UpdateTimeOffDto } from './dto/update-time-off.dto.js';

// Service xử lý nghiệp vụ CRUD cho Đơn xin nghỉ phép
@Injectable()
export class TimeOffsService {
  constructor(
    @InjectRepository(TimeOff)
    private readonly timeOffRepository: Repository<TimeOff>,
  ) {}

  create(dto: CreateTimeOffDto) {
    const timeOff = this.timeOffRepository.create(dto);
    return this.timeOffRepository.save(timeOff);
  }

  findAll() {
    return this.timeOffRepository.find({
      relations: { employee: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const timeOff = await this.timeOffRepository.findOne({
      where: { id },
      relations: { employee: true },
    });
    if (!timeOff) {
      throw new NotFoundException(`Không tìm thấy đơn nghỉ phép #${id}`);
    }
    return timeOff;
  }

  async update(id: number, dto: UpdateTimeOffDto) {
    const timeOff = await this.findOne(id);
    Object.assign(timeOff, dto);
    return this.timeOffRepository.save(timeOff);
  }

  async remove(id: number) {
    const timeOff = await this.findOne(id);
    await this.timeOffRepository.remove(timeOff);
    return { id };
  }
}
