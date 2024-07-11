import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Bookmark } from '../bookmark/entities';
import { Purchase } from '../purchase/entities';
import { Repository } from 'typeorm';
import { bookmarks, purchases, users } from './data/seed-data';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
import { ValidRoles } from 'src/auth/interfaces';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  async executeSeed() {
    await this.deleteAll();

    const productIds = await this.getProductsIds();

    const buyerUsers = users.filter((u) => u.roles.includes(ValidRoles.buyer));

    await this.userRepository.save(users);

    const generateEntities = <T>(
      users: User[],
      productIds: string[],
      generatorFunction: (user: User, productIds: string[]) => T[],
    ): T[] => {
      return users.flatMap((user) =>
        generatorFunction(user, Array.from(new Set(productIds))),
      );
    };

    const bookmarksEntities = generateEntities(
      buyerUsers as User[],
      productIds,
      bookmarks,
    );
    const purchaseEntities = generateEntities(
      buyerUsers as User[],
      productIds,
      purchases,
    );

    await this.bookmarkRepository.save(bookmarksEntities);
    await this.purchaseRepository.save(purchaseEntities);
    return 'Seed Executed';
  }

  getRandomUniqueElements(arr: string[], numElements: number): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, numElements);
  }

  async getProductsIds() {
    const categories = await this.categoryService.getCategories();
    const productsPromises = categories.map(async (c) => {
      {
        const product = await this.productService.getProductsByCategory(c.id, {
          offset: 0,
          limit: 10,
        });
        return product.map((p) => p.id);
      }
    });
    const products = await Promise.all(productsPromises);

    return products.flat();
  }

  async deleteAll() {
    await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .where({})
      .execute();
    await this.userRepository
      .createQueryBuilder('bookmark')
      .delete()
      .where({})
      .execute();
    await this.userRepository
      .createQueryBuilder('purchase')
      .delete()
      .where({})
      .execute();
  }
}
