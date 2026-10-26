import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard bảo vệ route bằng access token - gắn vào các controller cần đăng nhập
@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {}
