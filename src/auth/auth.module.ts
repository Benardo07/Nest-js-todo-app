import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './startegy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';


@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,  // Ensure ConfigModule is imported if not globally available
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here if JwtModule needs it
      inject: [ConfigService], // Inject ConfigService to use it in useFactory
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallbackSecret'),  // Use a fallback if env variable is not set
        signOptions: { expiresIn: '1h' }
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
