import { Injectable } from '@nestjs/common';
import { MeliService } from '../meli/meli.service';
import { CriteriaDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly meliService: MeliService) {}

  async getProductsByCategory(categoryId: string, criteria: CriteriaDto) {
    const products = await this.meliService.getProductsByCategory(
      categoryId,
      {
        offset: criteria.offset,
        limit: criteria.limit,
      },
      criteria.keyword,
    );

    const productsDetailPromises = products.map((p) =>
      this.meliService.getProductById(p.id),
    );

    return await Promise.all(productsDetailPromises);
  }
}
