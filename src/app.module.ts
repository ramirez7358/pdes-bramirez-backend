import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeliModule } from './meli/meli.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CustomNamingStrategy } from './naming-strategy';
import { PassportModule } from '@nestjs/passport';
import { PurchaseModule } from './purchase/purchase.module';
import { SeedModule } from './seed/seed.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new CustomNamingStrategy(),
    }),
    MeliModule,
    ProductModule,
    CategoryModule,
    BookmarkModule,
    PassportModule,
    PurchaseModule,
    SeedModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
