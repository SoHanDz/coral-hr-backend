import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAccessGuard } from './guards/jwt-access.guard.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

// Controller xác thực: login / refresh / logout / me
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // Ghi refresh token vào cookie httpOnly - chỉ gửi kèm khi gọi các route /auth/*
  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      // Production: frontend (Vercel) và backend (Render) khác site nên cần 'none' + secure
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày - khớp với JWT_REFRESH_EXPIRES_IN mặc định
    });
  }

  @ApiOperation({ summary: 'Đăng nhập, trả về access token và set refresh token vào cookie' })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto.email, dto.password);
    this.setRefreshCookie(res, refreshToken);
    return { accessToken, user };
  }

  @ApiOperation({ summary: 'Cấp access token mới từ refresh token trong cookie' })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token');

    const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, newRefreshToken);
    return { accessToken, user };
  }

  @ApiOperation({ summary: 'Đăng xuất, thu hồi refresh token và xoá cookie' })
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    await this.authService.logoutByRefreshToken(refreshToken);
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    res.clearCookie(REFRESH_COOKIE_NAME, {
      path: '/auth',
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    });
    return { success: true };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại từ access token' })
  @UseGuards(JwtAccessGuard)
  @Get('me')
  me(@Req() req: Request) {
    const { userId } = req.user as { userId: number };
    return this.authService.me(userId);
  }
}
