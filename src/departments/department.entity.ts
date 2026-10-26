import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Employee } from '../employees/employee.entity.js';

// Thực thể Phòng ban
@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Relation<Employee>[];
}
