import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { TimeOffsModule } from './time-offs/time-offs.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    // Đọc file .env, cho phép dùng ConfigService ở mọi module
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối MySQL qua TypeORM, lấy thông tin từ biến môi trường
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', '123456'),
        database: config.get<string>('DB_DATABASE', 'coral_hr'),
        autoLoadEntities: true,
        // Tự động đồng bộ schema theo entity - chỉ dùng cho môi trường dev
        synchronize: true,
      }),
    }),

    UsersModule,
    AuthModule,
    DepartmentsModule,
    EmployeesModule,
    TimeOffsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
