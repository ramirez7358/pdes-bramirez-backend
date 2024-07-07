import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeliTokens } from './entities/meli-tokens.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import { MeliCategory, MeliProduct } from './interfaces/meli.interfaces';
import { PaginationDto } from 'src/common/pagination.dto';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class MeliService {
  private readonly logger = new Logger('MeliService');

  private readonly COUNTRY_CODE = 'MLA';
  private readonly BASE_URL = 'https://api.mercadolibre.com';
  private readonly COUNTRY_BASE_URL = `${this.BASE_URL}/sites/${this.COUNTRY_CODE}`;
  private readonly AUTH_BASE_URL = 'https://api.mercadolibre.com/oauth/token';

  private accessToken: string;

  constructor(
    @InjectRepository(MeliTokens)
    private readonly meliTokensRepository: Repository<MeliTokens>,
    private readonly httpService: HttpService,
  ) {
    this.loadKeys().catch((error) => {
      this.logger.error('Failed to load keys', error);
    });
  }

  async getProductById(productId: string): Promise<MeliProduct | undefined> {
    try {
      const observable = this.httpService
        .get(`${this.BASE_URL}/items/${productId}`)
        .pipe(map((response) => response.data));

      const response = await firstValueFrom(observable);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.logger.warn(`Product with id ${productId} not found`);
        return;
        //throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      this.logger.error(`Failed to fetch product with id ${productId}`, error);
      /*throw new HttpException(
        'Failed to fetch product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );*/
    }
  }

  async getProductsByCategory(
    categoryId: string,
    paginationDTO: PaginationDto,
  ): Promise<Array<MeliProduct>> {
    try {
      const observable = this.httpService
        .get(
          `${this.COUNTRY_BASE_URL}/search?category=${categoryId}&limit=${paginationDTO.limit}&offset=${paginationDTO.offset}`,
        )
        .pipe(map((response) => response.data));

      const response = await firstValueFrom(observable);

      return response.results;
    } catch (error) {
      this.logger.error('Failed to fetch products', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getCategories(): Promise<Array<{ id: string; name: string }>> {
    try {
      const observable = this.httpService
        .get(`${this.COUNTRY_BASE_URL}/categories`)
        .pipe(map((response) => response.data));

      const response = await firstValueFrom(observable);

      return response.map((category: MeliCategory) => ({
        id: category.id,
        name: category.name,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch categories', error);
      throw new Error('Failed to fetch categories');
    }
  }

  @Cron('0 0 */5 * * *')
  async testCron() {
    this.refreshToken();
  }

  private async loadKeys(): Promise<void> {
    try {
      const meliTokens = await this.meliTokensRepository.findOneBy({ id: '1' });

      if (meliTokens) {
        await this.refreshToken();
        this.logger.log(
          'Mercadolibre access tokens have been obtained from the database.',
        );
        return;
      }

      const tokensFromServiceObservable = this.getAccessToken();
      tokensFromServiceObservable.subscribe({
        next: async (response) => {
          this.accessToken = response.access_token;
          const meliTokens = this.meliTokensRepository.create({
            token: response.access_token,
            refresh_token: response.refresh_token,
          });

          await this.meliTokensRepository.save(meliTokens);

          this.logger.log(
            'Mercadolibre access tokens have been obtained from the get access token service.',
          );
        },
        error: (err) => {
          this.logger.error('Failed to get access token', err);
        },
      });
    } catch (error) {
      this.logger.error('Error loading keys', error);
      throw error;
    }
  }

  private getAccessToken(): Observable<any> {
    return this.httpService
      .post<TokenResponse>(this.AUTH_BASE_URL, {
        grant_type: 'authorization_code',
        client_id: process.env.ML_APP_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code: process.env.ML_CODE,
        redirect_uri: 'https://localhost/miapi',
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          this.logger.error('Error getting access token', error);
          return throwError(() => error);
        }),
      );
  }

  async refreshToken() {
    this.logger.log('Executing task to refresh access token');
    try {
      const meliTokens = await this.meliTokensRepository.findOneBy({
        id: '1',
      });
      const refreshTokenObservable = this.httpService
        .post<TokenResponse>(this.AUTH_BASE_URL, {
          grant_type: 'refresh_token',
          client_id: process.env.ML_APP_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          refresh_token: meliTokens.refresh_token,
          redirect_uri: 'https://localhost/miapi',
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error('Error refreshing token', error);
            return throwError(() => error);
          }),
        );

      refreshTokenObservable.subscribe({
        next: async (response) => {
          this.accessToken = response.access_token;

          meliTokens.token = response.access_token;
          meliTokens.refresh_token = response.refresh_token;

          await this.meliTokensRepository.save(meliTokens);

          this.logger.log('Access tokens have been refreshed successfully.');
        },
        error: (err) => {
          this.logger.error('Failed to refresh access token', err);
        },
      });
    } catch (error) {}
  }
}
