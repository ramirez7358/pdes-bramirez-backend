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

  @Column('bool', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['buyer'] })
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
