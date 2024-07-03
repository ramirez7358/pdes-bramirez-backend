import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports: [AuthModule],
})
export class PurchaseModule {}
