import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.admin)
  @Get('/user')
  async getUsers() {
    const users = await this.reportService.getUsers();
    return {
      statusCode: 200,
      data: users,
    };
  }

  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.admin)
  @Get('/bookmark')
  async getBookmarks() {
    const bookmarks = await this.reportService.getAllBookmarks();
    return {
      statusCode: 200,
      data: bookmarks,
    };
  }

  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.admin)
  @Get('/purchase')
  async getAllPurchases() {
    const purchases = await this.reportService.getAllPurchases();
    return {
      statusCode: 200,
      data: purchases,
    };
  }

  @ApiBearerAuth('access-token')
  @Auth(ValidRoles.admin)
  @Get('/')
  async getReports() {
    const reports = await this.reportService.getReports();
    return {
      statusCode: 200,
      data: reports,
    };
  }
}
