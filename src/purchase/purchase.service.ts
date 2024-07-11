import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePurchaseDTO } from './dto';
import { User } from 'src/auth/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities';
import { Repository } from 'typeorm';
import { MeliService } from '../meli/meli.service';
import { MeliProduct } from '../meli/interfaces/meli.interfaces';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger('PurchaseService');

  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly meliService: MeliService,
  ) {}

  async getPurchases(user: User) {
    const purchases = await this.purchaseRepository.find({
      where: {
        user: {id: user.id},
      },
      order: {
        created_at: 'desc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: purchases,
    };
  }

  async createPurchase(createPurchaseDto: CreatePurchaseDTO, user: User) {
    const meliProduct: MeliProduct | undefined =
      await this.meliService.getProductById(createPurchaseDto.productId);

    if (!meliProduct) {
      this.logger.error(
        `Product with id ${createPurchaseDto.productId} not found`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const newPurchase = this.purchaseRepository.create({
      user,
      meliId: createPurchaseDto.productId,
      name: meliProduct.title,
      price: meliProduct.price,
      count: createPurchaseDto.count,
    });

    try {
      await this.purchaseRepository.save(newPurchase);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create purchase',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Purchase added successfully',
      data: newPurchase,
    };
  }
}
