import { Controller, Post, Request, UseGuards, Get, Session, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';


@Controller('auth')
@serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: any) {
    return this.authService.login(loginDto, session); // Pass the whole DTO to the service
  }


  @Get('profile')
  getProfile(@Session() session: any) {
    if (session.user) {
      return { user: session.user, message: 'You are logged in' };
    } else {
      return { message: 'Not authenticated' };
    }
  }
}
