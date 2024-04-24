import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MeliService } from './meli.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [MeliService],
})
export class MeliModule {}
