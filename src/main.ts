import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Falha na inicialização:', err);
  process.exit(1);
});
