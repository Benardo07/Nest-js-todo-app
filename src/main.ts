import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieSession({
    name: 'AUTH_SESSION',
    keys: ['secret_key_1', 'secret_key_2'],  
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    secure: process.env.NODE_ENV === 'production',  // Enable secure in production
    httpOnly: true,
    sameSite: 'lax'
  }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  await app.listen(3000);
}
bootstrap();
