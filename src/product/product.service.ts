import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';
import { MeliService } from 'src/meli/meli.service';

@Injectable()
export class ProductService {
  constructor(private readonly meliService: MeliService) {}

  async getProductsByCategory(
    categoryId: string,
    paginationDTO: PaginationDto,
  ) {
    return await this.meliService.getProductsByCategory(
      categoryId,
      paginationDTO,
    );
  }
}
