import { IsInt, Max, Min } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmark')
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @Column('text')
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
}
