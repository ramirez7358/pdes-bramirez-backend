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

  @Column({
    type: 'varchar',
  })
  meliProductId: string;

  @Column('text')
  comment: string;

  @Column({
    type: 'int',
    default: 1,
    unsigned: true,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
