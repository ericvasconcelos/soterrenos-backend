/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import appConfig from 'src/app/config/app.config';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import globalConfig from 'src/global-config/global.config';
import { LandsModule } from 'src/lands/lands.module';
import { UserFactory } from 'src/users/factories/user.factory';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const createUser = UserFactory.create('owner');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing',
          password: 'cyen4311',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        LandsModule,
        UsersModule,
        GlobalConfigModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create user', async () => {


      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        id: expect.any(String),
        type: createUser.type,
        email: createUser.email,
        personalFirstName: createUser.personalFirstName,
        personalLastName: createUser.personalLastName,
        phoneNumber: createUser.phoneNumber,
        whatsappNumber: createUser.whatsappNumber,
        personalId: createUser.personalId,
        password: expect.any(String),
        isConfirmed: false,
        profileImage: null,
        creci: '',
        creciState: '',
        companyId: '',
        tradeName: '',
        legalName: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return that email exists', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe('EMAIL_ALREADY_REGISTERED');
    });

    it('should return password error message that must be longer', async () => {
      const currCreateUser = {
        ...createUser,
        password: '1'
      }

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(currCreateUser)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
        'password must be longer than or equal to 8 characters',
      ]));
    });

    it('should return password error message that must be complex', async () => {
      const currCreateUser = {
        ...createUser,
        password: 'qwert1234'
      }

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(currCreateUser)
        .expect(HttpStatus.BAD_REQUEST);


      expect(response.body.message).toEqual([
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
      ]);
    });
  });
});