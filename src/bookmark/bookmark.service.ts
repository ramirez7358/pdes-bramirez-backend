import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  async addBookMark(productId: string) {
    let newBookMark = this.bookmarkRepository.create({
      meliProductId: productId,
    });

    await this.bookmarkRepository.save(newBookMark);
  }
}
