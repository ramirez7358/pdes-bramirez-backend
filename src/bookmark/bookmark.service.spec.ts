import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { MeliService } from '../meli/meli.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Importación de getRepositoryToken
import { User } from 'src/auth/entities';
import { CreateBookmarkDTO } from './dto';
import { MeliProduct } from 'src/meli/interfaces/meli.interfaces';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

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
            getProductById: sinon.stub(),
          },
        },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
    repository = module.get<Repository<Bookmark>>(getRepositoryToken(Bookmark));
    meliService = module.get<MeliService>(MeliService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
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

    sinon.stub(meliService, 'getProductById').resolves(meliProduct);
    sinon.stub(repository, 'create').returns(createBookmarkDto as any);
    sinon.stub(repository, 'save').resolves(createBookmarkDto as any);

    const result = await service.addBookMark(createBookmarkDto, user);
    expect(result).to.deep.equal({
      statusCode: 200,
      message: 'Bookmark added successfully',
      data: createBookmarkDto,
    });
    expect(meliService.getProductById).to.have.been.calledWith('123');
    expect(repository.create).to.have.been.calledWith({
      meliProductId: '123',
      user,
      name: 'Test Product',
      comment: 'Great!',
      score: 10,
    });
    expect(repository.save).to.have.been.calledWith(createBookmarkDto as any);
  });
});
