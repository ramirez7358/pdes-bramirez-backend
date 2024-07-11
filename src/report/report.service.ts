import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Repository } from 'typeorm';
import { Bookmark } from '../bookmark/entities';
import { Purchase } from 'src/purchase/entities';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}
  async getUsers(): Promise<Partial<User>[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'fullName'],
    });
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return await this.bookmarkRepository.find({
      relations: ['user'],
    });
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return await this.purchaseRepository.find({
      relations: ['user'],
    });
  }

  async getReports() {
    return {
      topUsers: await this.getTopBuyingUsers(),
      topProducts: await this.getTopSellingProducts(),
      topBookmarks: await this.getFavoriteProducts(),
    };
  }

  async getTopSellingProducts(): Promise<any[]> {
    return await this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('purchase.name', 'name')
      .addSelect('SUM(purchase.count)', 'totalsold')
      .groupBy('purchase.name')
      .orderBy('totalsold', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getTopBuyingUsers(): Promise<any[]> {
    return await this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('user.id', 'userId')
      .addSelect('user.fullName', 'fullName')
      .addSelect('COUNT(purchase.id)', 'totalpurchases')
      .innerJoin('purchase.user', 'user')
      .groupBy('user.id, user.fullName')
      .orderBy('totalpurchases', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getFavoriteProducts(): Promise<any[]> {
    return await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .select('bookmark.name', 'name')
      .addSelect('COUNT(bookmark.id)', 'totalbookmarks')
      .groupBy('bookmark.name')
      .orderBy('totalbookmarks', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
