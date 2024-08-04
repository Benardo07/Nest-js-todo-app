import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ default: true })
  isDone: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
