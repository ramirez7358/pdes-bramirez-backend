import { Controller } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookmarks')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
}
