import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MeliModule } from 'src/meli/meli.module';

@Module({
  imports: [MeliModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
