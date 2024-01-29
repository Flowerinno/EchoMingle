import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true },
  });

  app.use(json({ limit: '50mb' }));

  await app.listen(8080);
}
bootstrap();
