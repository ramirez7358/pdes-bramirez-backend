import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeliService } from '../meli/meli.service';
import { Purchase } from './entities';
import { CreatePurchaseDTO } from './dto/create-purchase.dto';
import { User } from '../auth/entities';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let purchaseRepository: Repository<Purchase>;
  let meliService: MeliService;

  const mockPurchaseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockMeliService = {
    getProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useValue: mockPurchaseRepository,
        },
        {
          provide: MeliService,
          useValue: mockMeliService,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    purchaseRepository = module.get<Repository<Purchase>>(
      getRepositoryToken(Purchase),
    );
    meliService = module.get<MeliService>(MeliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPurchase', () => {
    const user: User = {
      id: '1',
      email: 'testuser@example.com',
      password: 'password',
      fullName: 'Test User',
      isActive: true,
      roles: ['buyer'],
      bookmarks: [],
      purchases: [],
      checkFieldsBeforeInsert: jest.fn(),
      checkFieldsBeforeUpdate: jest.fn(),
    };

    const createPurchaseDto: CreatePurchaseDTO = {
      productId: 'MLA1234',
      price: 100,
      count: 2,
    };

    it('should create a purchase successfully', async () => {
      const meliProduct = {
        id: 'MLA1234',
        title: 'Test Product',
        price: 100,
      } as any;
      mockMeliService.getProductById.mockResolvedValue(meliProduct);
      mockPurchaseRepository.create.mockReturnValue({
        user,
        meliId: createPurchaseDto.productId,
        name: meliProduct.title,
        price: createPurchaseDto.price,
        count: createPurchaseDto.count,
      });
      mockPurchaseRepository.save.mockResolvedValue({
        user,
        meliId: createPurchaseDto.productId,
        name: meliProduct.title,
        price: createPurchaseDto.price,
        count: createPurchaseDto.count,
      });

      const result = await service.createPurchase(createPurchaseDto, user);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('Purchase added successfully');
      expect(result.data).toEqual({
        user,
        meliId: createPurchaseDto.productId,
        name: meliProduct.title,
        price: createPurchaseDto.price,
        count: createPurchaseDto.count,
      });
    });

    it('should throw a 404 error if product is not found', async () => {
      mockMeliService.getProductById.mockResolvedValue(null);

      await expect(
        service.createPurchase(createPurchaseDto, user),
      ).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an internal server error if repository save fails', async () => {
      const meliProduct = {
        id: 'MLA1234',
        title: 'Test Product',
        price: 100,
      } as any;
      mockMeliService.getProductById.mockResolvedValue(meliProduct);
      mockPurchaseRepository.create.mockReturnValue({
        user,
        meliId: createPurchaseDto.productId,
        name: meliProduct.title,
        price: createPurchaseDto.price,
        count: createPurchaseDto.count,
      });
      mockPurchaseRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.createPurchase(createPurchaseDto, user),
      ).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to create purchase',
            error: 'Database error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
