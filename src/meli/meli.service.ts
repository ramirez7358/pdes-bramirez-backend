import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeliTokens } from './entities/meli-tokens.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class MeliService {
  private readonly logger = new Logger('MeliService');

  private readonly COUNTRY_CODE = 'MLA';
  private readonly BASE_URL = `https://api.mercadolibre.com/sites/${this.COUNTRY_CODE}`;
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
