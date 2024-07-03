import { Injectable } from '@nestjs/common';
import { CreatePurchaseDTO } from './dto';
import { User } from 'src/auth/entities';

@Injectable()
export class PurchaseService {
  async createPurchase(createPurchaseDto: CreatePurchaseDTO, user: User) {
    return createPurchaseDto;
  }
}
