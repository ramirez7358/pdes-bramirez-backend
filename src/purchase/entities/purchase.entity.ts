import { User } from '../../auth/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @Column()
  meliId: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  count: number;
}
