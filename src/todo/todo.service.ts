import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const todo = this.todoRepository.create(createTodoDto);
    todo.user = user; // Set the user on the Todo entity
    return this.todoRepository.save(todo);
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find({ relations: ['user'] });
  }

  async findMyTodo(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.todoRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: id },
      relations: ['user']
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo> {
    const todo =  await this.findOne(id);
    if (todo.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to update');
    }
    this.todoRepository.merge(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, user: User): Promise<void> {
    const todo =  await this.findOne(id);
    if (todo.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete');
    }
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  async markDone(id: number, user: User): Promise<Todo> {
    console.log("halo")
    const todo = await this.findOne(id);
    console.log(todo)
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    console.log(todo.user.id)
    if (todo.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to mark this todo as done');
    }
    todo.isDone = true;
    return this.todoRepository.save(todo);
  }

  async markUndone(id: number, user: User): Promise<Todo> {
    const todo =  await this.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    if (todo.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to mark this todo as undone');
    }
    todo.isDone = false;
    return this.todoRepository.save(todo);
  }
}
