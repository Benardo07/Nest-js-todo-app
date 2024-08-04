import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');
import cookieParser = require('cookie-parser');
export const setupApp = (app:any) => {
  app.use(cookieParser());
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
}
