import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from '../auth/auth.module';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    BookmarkModule,
    PurchaseModule,
    CategoryModule,
    ProductModule,
  ],
})
export class SeedModule {}
