import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { CategoryModule } from 'src/category/category.module';
import { ProductModule } from 'src/product/product.module';

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
