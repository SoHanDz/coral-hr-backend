import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

// Service xử lý nghiệp vụ CRUD cho Nhân viên
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  create(dto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(dto);
    return this.employeeRepository.save(employee);
  }

  findAll() {
    return this.employeeRepository.find({
      relations: { department: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { department: true },
    });
    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên #${id}`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeeRepository.save(employee);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    return { id };
  }
}
