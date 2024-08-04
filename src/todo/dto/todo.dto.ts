import { Expose, Type } from 'class-transformer';

class UserDto {
    @Expose()
    id: number;

    @Expose()
    name: string;
}

export class TodoDto {
    @Expose()
    id:string;
    
    @Expose()
    title: string;

    @Expose()
    isDone: boolean;

    @Expose()
    dueDate: Date;

    @Type(() => UserDto)
    @Expose()
    user: UserDto;
}