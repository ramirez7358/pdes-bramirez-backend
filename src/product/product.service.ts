import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';
import { MeliService } from '../meli/meli.service';

@Injectable()
export class ProductService {
  constructor(private readonly meliService: MeliService) {}

  async getProductsByCategory(
    categoryId: string,
    paginationDTO: PaginationDto,
  ) {
    const products = await this.meliService.getProductsByCategory(
      categoryId,
      paginationDTO,
    );

    const productsDetailPromises = products.map((p) =>
      this.meliService.getProductById(p.id),
    );

    return await Promise.all(productsDetailPromises);
  }
}
