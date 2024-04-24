import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeliService {
  private readonly BASE_URL: string =
    'https://api.mercadolibre.com/oauth/token';

  constructor(private readonly httpService: HttpService) {}

  async getAccessToken() {
    return this.httpService.post(this.BASE_URL, {
      grant_type: 'authorization_code',
      client_id: '',
      client_secret: '',
      code: '',
      redirect_uri: 'https://localhost/miapi',
    });
  }

  async getRefreshToken() {
    return this.httpService.post(this.BASE_URL, {
      grant_type: 'refresh_token',
      client_id: '',
      client_secret: '',
      refresh_token: '',
      redirect_uri: 'https://localhost/miapi',
    });
  }
}
