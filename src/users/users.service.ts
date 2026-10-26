import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

// Service đọc/ghi User - chỉ các thao tác AuthService cần, không có CRUD admin
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async setRefreshTokenHash(userId: number, refreshTokenHash: string | null) {
    await this.userRepository.update(userId, { refreshTokenHash });
  }
}
