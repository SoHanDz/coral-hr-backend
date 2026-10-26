import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
}

// Thực thể Người dùng - dùng để đăng nhập vào hệ thống
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 150 })
  fullName: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.HR })
  role: UserRole;

  // Hash của refresh token hiện tại (đã hash, không lưu plain text).
  // null nghĩa là user không có session đang hoạt động (đã logout / chưa từng login).
  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
