import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities';
import { MeliModule } from '../meli/meli.module';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports: [TypeOrmModule.forFeature([Purchase]), AuthModule, MeliModule],
  exports: [TypeOrmModule],
})
export class PurchaseModule {}
