import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async create(createUserDto: CreateUserDto): Promise<User> {
      const user = await this.userRepository.findOneBy({email: createUserDto.email});
        if(user){
          throw new ConflictException('Email already exists');
        }
        const salt = 10;
        const hash = await bcrypt.hash(createUserDto.password, salt);

        const newUser = this.userRepository.create({
          ...createUserDto,
          password: hash,
        });
        return this.userRepository.save(newUser);


      }
    
      findAll(): Promise<User[]> {
        return this.userRepository.find();
      }
    
      async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
      }

      async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({email});
        if (!user) {
          throw new NotFoundException(`User with name ${email} not found`);
        }
        return user;
      }
    
      async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        this.userRepository.merge(user, updateUserDto);
        return this.userRepository.save(user);
      }
    
      async remove(id: number): Promise<{ message: string }> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return { message: `User with ID ${id} successfully deleted` };
    }
}
