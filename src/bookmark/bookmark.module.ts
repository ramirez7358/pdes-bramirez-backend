import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { AuthModule } from '../auth/auth.module';
import { MeliModule } from '../meli/meli.module';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  imports: [TypeOrmModule.forFeature([Bookmark]), AuthModule, MeliModule],
  exports: [TypeOrmModule],
})
export class BookmarkModule {}
