/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import appConfig from 'src/app/config/app.config';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import globalConfig from 'src/global-config/global.config';
import { LandsModule } from 'src/lands/lands.module';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserTypeEnum } from 'src/users/dto/types';
import { UserFactory } from 'src/users/factories/user.factory';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';

const login = async (
  app: INestApplication,
  user: CreateUserDto & { id: string },
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user.email, password: user.password });

  return {
    accessToken: response.body.accessToken,
    user
  }
};

const createUserAndLogin = async (app: INestApplication) => {
  const user = UserFactory.create(UserTypeEnum.OWNER);
  const newUser = await request(app.getHttpServer()).post('/users').send(user);
  return login(app, { ...user, id: newUser.body.id });
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const createUser = UserFactory.create(UserTypeEnum.OWNER);
  const fakeUUID = '44f2636a-f756-4686-b37b-233b8accd128'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(globalConfig)],
          inject: [globalConfig.KEY],
          useFactory: (globalConfigurations: ConfigType<typeof globalConfig>) => {
            return {
              type: globalConfigurations.db_testing.type,
              host: globalConfigurations.db_testing.host,
              port: globalConfigurations.db_testing.port,
              username: globalConfigurations.db_testing.username,
              database: globalConfigurations.db_testing.database,
              password: globalConfigurations.db_testing.password,
              autoLoadEntities: globalConfigurations.db_testing.autoLoadEntities,
              synchronize: globalConfigurations.db_testing.synchronize,
              dropSchema: globalConfigurations.db_testing.dropSchema,
            }
          }
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

  describe('GET /users', () => {
    it('should return all users', async () => {
      const createdUser = await createUserAndLogin(app)

      const response = await request(app.getHttpServer())
        .get('/users')
        .send({ type: UserTypeEnum.OWNER })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              personalId: createdUser.user.personalId,
              personalFirstName: createdUser.user.personalFirstName,
              personalLastName: createdUser.user.personalLastName,
            }),
          ]),
        })
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return user data', async () => {
      const createdUser = await createUserAndLogin(app)

      const response = await request(app.getHttpServer())
        .get(`/users/${createdUser.user.id}`)
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          personalId: createdUser.user.personalId,
          personalFirstName: createdUser.user.personalFirstName,
          personalLastName: createdUser.user.personalLastName,
        }),
      );
    });

    it('should return error of user not found', async () => {
      const createdUser = await createUserAndLogin(app)

      await request(app.getHttpServer())
        .get(`/users/${fakeUUID}`)
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      const createdUser = await createUserAndLogin(app)
      const userId = createdUser.user.id;

      const updateResponse = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({
          personalFirstName: 'Updated',
        })
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.OK);

      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          id: userId,
          personalFirstName: 'Updated',
        }),
      );
    });

    it('should return error of user not found', async () => {
      const createdUser = await createUserAndLogin(app)

      await request(app.getHttpServer())
        .patch(`/users/${fakeUUID}`)
        .send({ personalFirstName: 'Updated' })
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /users/:id', () => {
    it('sould remove user', async () => {
      const createdUser = await createUserAndLogin(app)
      const userId = createdUser.user.id;

      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.message).toBe('USER_DELETED');
    });

    it('should return error of user not found', async () => {
      const createdUser = await createUserAndLogin(app)

      await request(app.getHttpServer())
        .delete(`/users/${fakeUUID}`)
        .set('Authorization', `Bearer ${createdUser.accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});