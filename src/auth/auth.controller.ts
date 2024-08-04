import { Controller, Post, Request, UseGuards, Get, Session, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
@serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Session() session: any, @Res() res: Response) {
    console.log("halo")
    const result  = await this.authService.login(loginDto, session); 
    res.json([result]);
  }


  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Session() session: any, @Res() res: Response) {
    if (session.user) {
      res.json({ user: session.user, message: 'You are logged in' });
    } else {
      res.json({ message: 'Not authenticated' });
    }
  }
  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Session() session:any){
    session.jwt = null; 
    console.log("log Out succes");
    return "Succes logout";
  }


}
