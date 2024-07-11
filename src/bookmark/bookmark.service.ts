import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { CreateBookmarkDTO } from './dto';
import { MeliService } from '../meli/meli.service';

@Injectable()
export class BookmarkService {
  private readonly logger = new Logger('BookmarkService');
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly meliService: MeliService,
  ) {}

  async deleteBookmark(bookmarkId: string, user: User) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id: bookmarkId, user: { id: user.id } },
      relations: ['user'],
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with id ${bookmarkId} not found`);
    }

    if (bookmark.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this bookmark',
      );
    }

    await this.bookmarkRepository.remove(bookmark);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  async getBookmarks(user: User) {
    const bookmarks = await this.bookmarkRepository.find({
      where: {
        user: { id: user.id },
      },
      order: {
        created_at: 'desc',
      },
    });

    this.logger.log(
      `${bookmarks.length} products was found!`,
    );

    return {
      statusCode: HttpStatus.OK,
      data: bookmarks,
    };
  }

  async addBookMark(createBookMarkDto: CreateBookmarkDTO, user: User) {
    const bookmark = await this.bookmarkRepository.findOneBy({
      meliProductId: createBookMarkDto.productId,
    });

    if (bookmark) {
      throw new ConflictException(
        'The product has already been added to bookmark',
      );
    }

    const meliProduct = await this.meliService.getProductById(
      createBookMarkDto.productId,
    );

    const newBookMark = this.bookmarkRepository.create({
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
