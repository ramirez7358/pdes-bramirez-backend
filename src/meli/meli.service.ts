import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeliTokens } from './entities/meli-tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeliService {
  private readonly BASE_URL: string =
    'https://api.mercadolibre.com/oauth/token';

  private accessToken: string;
  private refreshToken: string;

  constructor(
    @InjectRepository(MeliTokens)
    private readonly meliTokensRepository: Repository<MeliTokens>,
    private readonly httpService: HttpService,
  ) {
    this.loadKeys().then((_) => {
      console.log('The keys have been successfully loaded!');
    });
  }

  private async loadKeys() {
    const meliTokens = await this.meliTokensRepository.findOneBy({ id: '1' });

    if (meliTokens) {
      this.accessToken = meliTokens.token;
      this.refreshToken = meliTokens.refresh_token;
      console.log(
        'Mercadolibre access tokens have been obtained from the database.',
      );
      return;
    }

    const tokensFromServiceObservable = await this.getAccessToken();
    tokensFromServiceObservable.subscribe(async (response) => {
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      const meliTokens = this.meliTokensRepository.create({
        token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      });

      await this.meliTokensRepository.save(meliTokens);

      console.log(
        'Mercadolibre access tokens have been obtained from the get access token service.',
      );
    });
  }

  private async getAccessToken() {
    return this.httpService.post(this.BASE_URL, {
      grant_type: 'authorization_code',
      client_id: process.env.ML_APP_ID,
      client_secret: process.env.ML_CLIENT_SECRET,
      code: process.env.ML_CODE,
      redirect_uri: 'https://localhost/miapi',
    });
  }

  private async getRefreshToken() {
    return this.httpService.post(this.BASE_URL, {
      grant_type: 'refresh_token',
      client_id: process.env.ML_APP_ID,
      client_secret: process.env.ML_CLIENT_SECRET,
      refresh_token: '',
      redirect_uri: 'https://localhost/miapi',
    });
  }
}
