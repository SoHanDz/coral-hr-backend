import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đọc cookie (refresh token) từ request
  app.use(cookieParser());

  // Cho phép Frontend gọi API xuống Backend, kèm cookie (refresh token).
  // Vite tự nhảy port (5173 -> 5174 -> ...) khi port đang bận, nên ở dev ta cho phép
  // mọi origin localhost/127.0.0.1 bất kể port, thay vì hardcode đúng 1 port cố định.
  const isProduction = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!isProduction) {
        const isLocalDev = !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
        return callback(null, isLocalDev);
      }
      // Production: chỉ cho phép đúng domain frontend khai báo trong .env
      callback(null, origin === process.env.FRONTEND_URL);
    },
    credentials: true,
  });

  // Tự validate DTO theo decorator của class-validator, loại field không khai báo
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger UI - xem & thử toàn bộ API tại /api-docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Coral HR API')
    .setDescription('Tài liệu API cho hệ thống quản lý nhân sự Coral HR')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // tên này dùng lại ở @ApiBearerAuth('access-token') trong controller
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
