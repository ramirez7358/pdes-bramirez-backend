import { Injectable } from '@nestjs/common';
import { MeliService } from 'src/meli/meli.service';

@Injectable()
export class CategoryService {
  constructor(private readonly meliService: MeliService) {}

  async getCategories() {
    return await this.meliService.getCategories();
  }
}
