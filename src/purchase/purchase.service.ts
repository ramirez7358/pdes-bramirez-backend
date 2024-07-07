import { Injectable } from '@nestjs/common';
import { CreatePurchaseDTO } from './dto';
import { User } from 'src/auth/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async createPurchase(createPurchaseDto: CreatePurchaseDTO, user: User) {
    return createPurchaseDto;
  }
}
