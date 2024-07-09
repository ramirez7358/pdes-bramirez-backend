import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    BookmarkModule,
    PurchaseModule
  ]
})
export class SeedModule {}