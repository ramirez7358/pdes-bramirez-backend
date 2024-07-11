import { Purchase } from '../../purchase/entities/purchase.entity';
import { Bookmark } from '../../bookmark/entities/';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ValidRoles } from '../interfaces';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { name: 'full_name' })
  fullName: string;

  @Column({
    type: 'integer',
    default: 1,
    transformer: {
      to(value: boolean): number {
        return value ? 1 : 0;
      },
      from(value: number): boolean {
        return value === 1;
      },
    },
  })
  isActive: boolean;

  @Column('simple-array', { default: 'buyer' })
  roles: ValidRoles[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { cascade: true })
  bookmarks: Bookmark[];

  @OneToMany(() => Purchase, (purchase) => purchase.user, { cascade: true })
  purchases: Purchase[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
