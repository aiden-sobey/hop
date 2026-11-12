import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { config } from './config';
import { runMigrations } from './db/migrate';
import { logger } from './logger';

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  // Requests reach us through the load balancer.
  app.set('trust proxy', true);
  app.enableShutdownHooks();

  await app.listen(config.port);
  logger.info(`readings-api listening on ${config.port}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start', { error: error instanceof Error ? error.stack : error });
  process.exit(1);
});
