import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Employee } from '../employees/employee.entity.js';

export enum TimeOffStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Thực thể Đơn xin nghỉ phép - quan hệ n-1 với Nhân viên
@Entity('time_offs')
export class TimeOff {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.timeOffs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Relation<Employee>;

  @Column()
  employeeId: number;

  @Column({ type: 'date' })
  fromDate: string;

  @Column({ type: 'date' })
  toDate: string;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({
    type: 'enum',
    enum: TimeOffStatus,
    default: TimeOffStatus.PENDING,
  })
  status: TimeOffStatus;

  @CreateDateColumn()
  createdAt: Date;
}
