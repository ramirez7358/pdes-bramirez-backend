import { IsInt, Max, Min } from 'class-validator';
import { User } from '../../auth/entities/';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('bookmark')
@Unique(['user', 'meliProductId'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @Column('varchar')
  name: string;

  @Column('varchar')
  meliProductId: string;

  @Column('text')
  comment: string;

  @Column({
    type: 'integer',
    default: 1,
    unsigned: true,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @CreateDateColumn()
  created_at: Date;
}
