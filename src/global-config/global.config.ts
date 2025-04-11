import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: +(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    autoLoadEntities: Boolean(process.env.DATABASE_AUTO_LOAD_ENTITIES),
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    dropSchema: Boolean(process.env.DATABASE_DROP_SCHEMA),
  },
  db_testing: {
    type: process.env.DB_TESTING_TYPE as 'postgres',
    host: process.env.DB_TESTING_HOST,
    port: +(process.env.DB_TESTING_PORT ?? 5432),
    username: process.env.DB_TESTING_USERNAME,
    database: process.env.DB_TESTING_DATABASE,
    password: process.env.DB_TESTING_PASSWORD,
    autoLoadEntities: Boolean(process.env.DB_TESTING_AUTO_LOAD_ENTITIES),
    synchronize: Boolean(process.env.DB_TESTING_SYNCHRONIZE),
    dropSchema: Boolean(process.env.DB_TESTING_DROP_SCHEMA),
  },
  environment: process.env.NODE_ENV || 'development',
}));
