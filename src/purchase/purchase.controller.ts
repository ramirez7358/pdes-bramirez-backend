import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CreatePurchaseDTO } from './dto';
import { User } from '../auth/entities';

@ApiTags('Purchases')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.buyer)
  async savePurchase(
    @Body() createPurchaseDto: CreatePurchaseDTO,
    @GetUser() user: User,
  ) {
    return this.purchaseService.createPurchase(createPurchaseDto, user);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.buyer)
  async getPurchases(@GetUser() user: User) {
    return this.purchaseService.getPurchases(user);
  }
}
