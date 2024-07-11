import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from '../common/pagination.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CriteriaDto } from './dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 200,
    description: 'List of products in the given category.',
  })
  @ApiParam({
    name: 'category_id',
    type: 'string',
    description:
      'ID of the category for which you want to retrieve products. The id must be one of those returned by the get categories service.',
  })
  @Get('/:category_id')
  async getCategories(
    @Param('category_id') categoryId: string,
    @Query() criteria: CriteriaDto,
  ) {
    return this.productService.getProductsByCategory(categoryId, criteria);
  }
}
