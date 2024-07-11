import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { MeliService } from '../meli/meli.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { CreateBookmarkDTO } from './dto';
import { MeliProduct } from 'src/meli/interfaces/meli.interfaces';
import { ConflictException, HttpStatus } from '@nestjs/common';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let repository: Repository<Bookmark>;
  let meliService: MeliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: getRepositoryToken(Bookmark),
          useClass: Repository,
        },
        {
          provide: MeliService,
          useValue: {
            getProductById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
    repository = module.get<Repository<Bookmark>>(getRepositoryToken(Bookmark));
    meliService = module.get<MeliService>(MeliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a bookmark', async () => {
    const meliProduct: MeliProduct = {
      id: '123',
      title: 'Test Product',
      condition: 'new',
      thumbnail_id: '12345',
      catalog_product_id: 'catalog123',
      listing_type_id: 'gold_special',
      permalink: 'http://example.com',
      buying_mode: 'buy_it_now',
      site_id: 'MLA',
      category_id: 'category123',
      domain_id: 'domain123',
      thumbnail: 'http://example.com/image.jpg',
      currency_id: 'ARS',
      order_backend: 1,
      price: 100,
      original_price: 120,
      sale_price: null,
      available_quantity: 10,
      official_store_id: null,
      use_thumbnail_id: true,
      accepts_mercadopago: true,
      shipping: {
        store_pick_up: false,
        free_shipping: true,
        logistic_type: 'fulfillment',
        mode: 'me2',
        tags: [],
        benefits: null,
        promise: null,
        shipping_score: 1,
      },
      stop_time: '2024-01-01T00:00:00Z',
      seller: {
        id: 1,
        nickname: 'seller123',
      },
      attributes: [],
      installments: null,
      winner_item_id: null,
      catalog_listing: true,
      discounts: null,
      promotions: [],
      inventory_id: 'inventory123',
    };

    const createBookmarkDto: CreateBookmarkDTO = {
      productId: '123',
      comment: 'Great!',
      score: 10,
    };
    const user: User = { id: '1', bookmarks: [] } as User;

    jest.spyOn(meliService, 'getProductById').mockResolvedValue(meliProduct);
    jest.spyOn(repository, 'create').mockReturnValue(createBookmarkDto as any);
    jest.spyOn(repository, 'save').mockResolvedValue(createBookmarkDto as any);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    const result = await service.addBookMark(createBookmarkDto, user);
    expect(result).toEqual({
      statusCode: 200,
      message: 'Bookmark added successfully',
      data: createBookmarkDto,
    });
    expect(meliService.getProductById).toHaveBeenCalledWith('123');
    expect(repository.create).toHaveBeenCalledWith({
      meliProductId: '123',
      user,
      name: 'Test Product',
      comment: 'Great!',
      score: 10,
    });
    expect(repository.save).toHaveBeenCalledWith(createBookmarkDto as any);
  });

  it('should return 409 if bookmark already exists', async () => {
    const createBookmarkDto: CreateBookmarkDTO = {
      productId: '123',
      comment: 'Great!',
      score: 10,
    };
    const user: User = { id: '1', bookmarks: [] } as User;

    const existingBookmark: Bookmark = {
      id: '1',
      meliProductId: '123',
      user,
      name: 'Test Product',
      comment: 'Existing Comment',
      score: 9,
      created_at: new Date(),
    } as Bookmark;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingBookmark);
    jest.spyOn(repository, 'create');
    jest.spyOn(repository, 'save');

    try {
      await service.addBookMark(createBookmarkDto, user);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual(
        'The product has already been added to bookmark',
      );
      expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    }

    expect(repository.findOneBy).toHaveBeenCalledWith({
      meliProductId: createBookmarkDto.productId,
    });
    expect(meliService.getProductById).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should return user bookmarks', async () => {
    const user: User = { id: '1', bookmarks: [] } as User;

    const bookmarks: Bookmark[] = [
      {
        id: '1',
        meliProductId: '123',
        user,
        name: 'Test Product 1',
        comment: 'Comment 1',
        score: 8,
        created_at: new Date(),
      } as Bookmark,
      {
        id: '2',
        meliProductId: '456',
        user,
        name: 'Test Product 2',
        comment: 'Comment 2',
        score: 9,
        created_at: new Date(),
      } as Bookmark,
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(bookmarks);

    const result = await service.getBookmarks(user);
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      data: bookmarks,
    });
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        user,
      },
      order: {
        created_at: 'desc',
      },
    });
  });
});
