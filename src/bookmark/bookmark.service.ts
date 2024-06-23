import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { CreateBookmarkDTO } from './dto';
import { MeliService } from '../meli/meli.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly meliService: MeliService,
  ) {}

  async addBookMark(createBookMarkDto: CreateBookmarkDTO, user: User) {
    let meliProduct = await this.meliService.getProductById(
      createBookMarkDto.productId,
    );

    let newBookMark = this.bookmarkRepository.create({
      meliProductId: createBookMarkDto.productId,
      user,
      name: meliProduct.title,
      comment: createBookMarkDto.comment,
      score: createBookMarkDto.score,
    });

    await this.bookmarkRepository.save(newBookMark);

    return {
      statusCode: HttpStatus.OK,
      message: 'Bookmark added successfully',
      data: newBookMark,
    };
  }
}
