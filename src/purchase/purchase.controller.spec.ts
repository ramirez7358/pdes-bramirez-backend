import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDTO } from './dto/create-purchase.dto';
import { User } from '../auth/entities';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let purchaseService: PurchaseService;

  const mockPurchaseService = {
    createPurchase: jest.fn(),
    getPurchases: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: mockPurchaseService,
        },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('savePurchase', () => {
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

    it('should call PurchaseService.createPurchase and return the result', async () => {
      const result = {
        statusCode: HttpStatus.OK,
        message: 'Purchase added successfully',
        data: {},
      };

      mockPurchaseService.createPurchase.mockResolvedValue(result);

      expect(await controller.savePurchase(createPurchaseDto, user)).toEqual(
        result,
      );
      expect(purchaseService.createPurchase).toHaveBeenCalledWith(
        createPurchaseDto,
        user,
      );
    });

    it('should throw an HttpException if PurchaseService.createPurchase fails', async () => {
      mockPurchaseService.createPurchase.mockRejectedValue(
        new HttpException(
          'Failed to create purchase',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(
        controller.savePurchase(createPurchaseDto, user),
      ).rejects.toThrow(
        new HttpException(
          'Failed to create purchase',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getPurchases', () => {
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

    it('should call PurchaseService.getPurchases and return the result', async () => {
      const result = {
        statusCode: HttpStatus.OK,
        data: [],
      };

      mockPurchaseService.getPurchases.mockResolvedValue(result);

      expect(await controller.getPurchases(user)).toEqual(result);
      expect(purchaseService.getPurchases).toHaveBeenCalledWith(user);
    });

    it('should throw an HttpException if PurchaseService.getPurchases fails', async () => {
      mockPurchaseService.getPurchases.mockRejectedValue(
        new HttpException(
          'Failed to fetch purchases',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.getPurchases(user)).rejects.toThrow(
        new HttpException(
          'Failed to fetch purchases',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
