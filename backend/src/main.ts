import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const logger = LoggerFactory.createLogger();
  app.useLogger(logger);

  await app.listen(3000);

  logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();