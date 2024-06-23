import { Body, Controller, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDTO } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Bookmarks')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.buyer)
  async createBookmark(
    @Body() createBookMarkDto: CreateBookmarkDTO,
    @GetUser() user: User,
  ) {
    return this.bookmarkService.addBookMark(createBookMarkDto, user);
  }
}
