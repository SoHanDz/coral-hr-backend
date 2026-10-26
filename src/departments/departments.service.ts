import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { UpdateDepartmentDto } from './dto/update-department.dto.js';

// Service xử lý nghiệp vụ CRUD cho Phòng ban
@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(dto);
    return this.departmentRepository.save(department);
  }

  findAll() {
    return this.departmentRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException(`Không tìm thấy phòng ban #${id}`);
    }
    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const department = await this.findOne(id);
    Object.assign(department, dto);
    return this.departmentRepository.save(department);
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
    return { id };
  }
}
