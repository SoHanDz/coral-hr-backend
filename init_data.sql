-- init_data.sql
-- Script tạo CSDL và dữ liệu mồi cho dự án CoralHR
-- Chạy file này trong phpMyAdmin (XAMPP) hoặc mysql CLI trước khi start backend.
-- Lưu ý: backend đã bật "synchronize: true" nên TypeORM sẽ tự tạo bảng theo entity,
-- bạn chỉ cần tạo DATABASE rồi chèn dữ liệu mồi (phần INSERT) sau khi backend đã
-- chạy ít nhất 1 lần để các bảng được sinh ra.

CREATE DATABASE IF NOT EXISTS coral_hr
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE coral_hr;

-- Dữ liệu mồi: User để đăng nhập (bảng "users" do TypeORM tự tạo khi backend đã chạy 1 lần)
-- Mật khẩu gốc: 123456 (đã hash bằng bcrypt, cost 10)
INSERT INTO users (id, email, fullName, passwordHash, role) VALUES
  (1, 'admin@coralhr.vn', 'Quản trị viên', '$2b$10$KSwM/lZ7Jp5/ZXCJCqN1/exZLm7mP4iSphDv6jCGBqpR9w8dLMC1m', 'admin');

-- Dữ liệu mồi: Phòng ban
INSERT INTO departments (id, name, description) VALUES
  (1, 'Phòng Nhân sự', 'Quản lý tuyển dụng, chính sách nhân sự'),
  (2, 'Phòng Kỹ thuật', 'Phát triển và vận hành hệ thống phần mềm'),
  (3, 'Phòng Kinh doanh', 'Phát triển khách hàng và doanh thu');

-- Dữ liệu mồi: Nhân viên
INSERT INTO employees (id, fullName, email, phone, position, status, departmentId) VALUES
  (1, 'Nguyễn Văn An', 'an.nguyen@coralhr.vn', '0901111222', 'HR Executive', 'active', 1),
  (2, 'Trần Thị Bình', 'binh.tran@coralhr.vn', '0902222333', 'Backend Developer', 'active', 2),
  (3, 'Lê Văn Cường', 'cuong.le@coralhr.vn', '0903333444', 'Sales Executive', 'active', 3);

-- Dữ liệu mồi: Đơn xin nghỉ phép
INSERT INTO time_offs (id, employeeId, fromDate, toDate, reason, status) VALUES
  (1, 1, '2026-11-01', '2026-11-02', 'Nghỉ việc riêng', 'pending'),
  (2, 2, '2026-11-05', '2026-11-05', 'Khám bệnh', 'approved');
