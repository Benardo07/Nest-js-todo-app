import { Controller, Post, Get, Put, Delete, Param, Body, Res, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { AdminGuard } from 'src/auth/guards/admin-auth.guards';
import { UserDto } from './dto/user.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';


@Controller('user')
@serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User): Promise<User> {
    if (user.id !== +id && !user.admin) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: number, @Res() res: Response):Promise<void> {

    const result = await this.userService.remove(id);
    res.json([result]);
  }
}
