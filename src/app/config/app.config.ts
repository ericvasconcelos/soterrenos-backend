import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export default (app: INestApplication) => {
  app.enableCors({ origin: process.env.ORIGIN });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  return app;
};