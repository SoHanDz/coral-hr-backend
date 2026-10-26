import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../jwt-payload.js';

// Xác thực access token gửi qua header "Authorization: Bearer <token>"
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
    });
  }

  // Giá trị trả về sẽ được Nest gắn vào req.user
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
