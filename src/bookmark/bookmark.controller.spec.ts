import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO } from './dto';
import { User } from '../auth/entities';
import { Bookmark } from './entities/bookmark.entity';
import { HttpStatus } from '@nestjs/common';

describe('BookmarkController', () => {
  let controller: BookmarkController;
  let service: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        {
          provide: BookmarkService,
          useValue: {
            addBookMark: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
    service = module.get<BookmarkService>(BookmarkService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bookmark', async () => {
    const createBookmarkDto: CreateBookmarkDTO = {
      productId: '123',
      comment: 'Great!',
      score: 10,
    };
    const user: User = { id: '1', bookmarks: [] } as User;
    const newBookmark: Bookmark = {
      id: 'uuid123',
      user,
      name: 'Test Product',
      meliProductId: '123',
      comment: 'Great!',
      score: 10,
    };

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Bookmark added successfully',
      data: newBookmark,
    };

    jest.spyOn(service, 'addBookMark').mockResolvedValue(result);

    expect(await controller.createBookmark(createBookmarkDto, user)).toBe(
      result,
    );
    expect(service.addBookMark).toHaveBeenCalledWith(createBookmarkDto, user);
  });
});
