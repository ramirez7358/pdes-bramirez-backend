import { Body, Controller, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDTO } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Bookmarks')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @Auth(ValidRoles.buyer)
  async createBookmark(
    @Body() createBookMarkDto: CreateBookmarkDTO,
    @GetUser() user: User,
  ) {
    return { createBookMarkDto, user };
  }
}
