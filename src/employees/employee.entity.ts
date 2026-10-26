import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Department } from '../departments/department.entity.js';
import { TimeOff } from '../time-offs/time-off.entity.js';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Thực thể Nhân viên - quan hệ n-1 với Phòng ban
@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string | null;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @ManyToOne(() => Department, (department) => department.employees, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'departmentId' })
  department: Relation<Department> | null;

  @Column({ type: 'int', nullable: true })
  departmentId: number | null;

  @OneToMany(() => TimeOff, (timeOff) => timeOff.employee)
  timeOffs: Relation<TimeOff>[];

  @CreateDateColumn()
  createdAt: Date;
}
