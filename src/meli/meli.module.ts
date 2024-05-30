import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MeliService } from './meli.service';
import { MeliTokens } from './entities/meli-tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([MeliTokens]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [MeliService],
  exports: [TypeOrmModule, MeliService],
})
export class MeliModule {}
