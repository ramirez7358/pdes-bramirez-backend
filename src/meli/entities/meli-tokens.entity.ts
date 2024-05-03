import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meli_tokens')
export class MeliTokens {
  @PrimaryGeneratedColumn()
  id: string;
  @Column('text', { unique: true, nullable: true })
  token: string;
  @Column('text', { unique: true, nullable: true })
  refresh_token: string;
}
