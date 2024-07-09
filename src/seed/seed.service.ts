import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Bookmark } from '../bookmark/entities';
import { Purchase } from '../purchase/entities';
import { Repository } from 'typeorm';
import { bookmarks, users } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async executeSeed() {
    await this.deleteAll();
    await this.userRepository.save(users)
    console.log(bookmarks)
    await this.bookmarkRepository.save(bookmarks)
    return 'Seed Executed';
  }

  async deleteAll() {
    await this.userRepository.createQueryBuilder("user").delete().where({}).execute()
    await this.userRepository.createQueryBuilder("bookmark").delete().where({}).execute()
    await this.userRepository.createQueryBuilder("purchase").delete().where({}).execute()
  }
}
