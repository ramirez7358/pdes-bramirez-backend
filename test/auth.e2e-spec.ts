import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/auth/entities/user.entity';
import { Bookmark } from '../src/bookmark/entities/bookmark.entity';
import { Purchase } from '../src/purchase/entities/purchase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User, Bookmark, Purchase],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User, Bookmark, Purchase]),
        JwtModule.register({
          secret: 'test_jwt_secret',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
    })
      .overrideProvider(JwtStrategy)
      .useFactory({
        factory: (userRepository: Repository<User>) => {
          return new JwtStrategy(userRepository);
        },
        inject: [getRepositoryToken(User)],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Asegúrate de usar ValidationPipe
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.query('DELETE FROM user');
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          fullName: 'Test User', // Asegúrate de enviar fullName
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'short',
          fullName: '', // Envía un valor no válido para fullName
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login an existing user', async () => {
      // First, register a user
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User', // Asegúrate de enviar fullName
      });

      // Then, try to login
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrongwrong@example.com',
          password: 'wrongPassword',
        })
        .expect(401);
    });
  });
});
