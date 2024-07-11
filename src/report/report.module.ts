import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [AuthModule, BookmarkModule, PurchaseModule],
})
export class ReportModule {}
