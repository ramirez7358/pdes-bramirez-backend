import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from '../common/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:category_id')
  async getCategories(
    @Param('category_id') categoryId: string,
    @Query() paginationDTO: PaginationDto,
  ) {
    return this.productService.getProductsByCategory(categoryId, paginationDTO);
  }
}
