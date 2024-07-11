import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.admin)
  @Get()
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
