import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { User } from 'src/user/user.entity';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { TodoDto } from './dto/todo.dto';

@Controller('todos')
@serialize(TodoDto)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTodoDto: CreateTodoDto, @CurrentUser() user: User): Promise<Todo> {
    return this.todoService.create(createTodoDto, user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get("/my")
  @UseGuards(AuthGuard('jwt'))
  findMyTodo(@CurrentUser() user: User): Promise<Todo[]> {
    return this.todoService.findMyTodo(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: number): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto,@CurrentUser() user: User ): Promise<Todo> {

    return this.todoService.update(id, updateTodoDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number,@CurrentUser() user: User): Promise<void> {

    return this.todoService.remove(id, user);
  }

  @Put(':id/done')
  @UseGuards(AuthGuard('jwt'))
  markDone(@Param('id') id: number, @CurrentUser() user: User): Promise<Todo> {

    return this.todoService.markDone(id, user);
  }

  @Put(':id/undone')
  @UseGuards(AuthGuard('jwt'))
  markUndone(@Param('id') id: number, @CurrentUser() user: User): Promise<Todo> {
    return this.todoService.markUndone(id, user);
  }

}
