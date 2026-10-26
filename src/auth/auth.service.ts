import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.entity.js';
import type { JwtPayload } from './jwt-payload.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

// Service xử lý nghiệp vụ xác thực: kiểm tra mật khẩu, phát hành/xoay refresh token
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private toSafeUser(user: User): SafeUser {
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    return user;
  }

  // Tạo cặp access token (sống ngắn) + refresh token (sống dài), hash refresh token rồi lưu DB
  private async issueTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as JwtSignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as JwtSignOptions['expiresIn'],
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    const tokens = await this.issueTokens(user);
    return { ...tokens, user: this.toSafeUser(user) };
  }

  // Xoay refresh token: verify -> đối chiếu hash trong DB -> phát hành cặp token mới
  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Phiên đăng nhập không còn hợp lệ');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      // Refresh token bị dùng lại trong khi đã bị thay thế (có thể bị đánh cắp) - khoá session ngay
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException('Phiên đăng nhập không còn hợp lệ');
    }

    const tokens = await this.issueTokens(user);
    return { ...tokens, user: this.toSafeUser(user) };
  }

  // Logout dựa trên refresh token (không bắt buộc access token còn hạn) - decode lấy userId rồi xoá hash trong DB
  async logoutByRefreshToken(refreshToken: string | undefined) {
    if (!refreshToken) return;
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
        ignoreExpiration: true,
      });
      await this.usersService.setRefreshTokenHash(payload.sub, null);
    } catch {
      // Token không hợp lệ - không có gì để xoá, bỏ qua
    }
  }

  async me(userId: number): Promise<SafeUser> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.toSafeUser(user);
  }
}
