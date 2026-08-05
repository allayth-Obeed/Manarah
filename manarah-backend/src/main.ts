import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express'; // ADDED: يلزم لاستخدام useStaticAssets
import { join } from 'path'; // ADDED
import { AppModule } from './app.module';

async function bootstrap() {
  // MODIFIED: NestExpressApplication بدل NestApplication الافتراضي لإتاحة useStaticAssets (تقديم صور المستخدمين)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // ADDED: تقديم مجلد uploads كملفات ثابتة على /uploads (صور المستخدمين المرفوعة)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.enableCors({
    origin: (origin, callback) => {
      // في وضع التطوير، اسمح بجميع الأصول (localhost, 127.0.0.1, etc.)
      if (!isProduction) {
        callback(null, true);
        return;
      }

      // في وضع الإنتاج، اسمح فقط بالأصول المحددة
      const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
