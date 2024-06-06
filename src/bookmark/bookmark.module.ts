import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  imports: [TypeOrmModule.forFeature([Bookmark])],
  exports: [TypeOrmModule],
})
export class BookmarkModule {}
