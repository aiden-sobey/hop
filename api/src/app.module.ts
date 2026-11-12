import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './db/database.module';
import { HealthModule } from './health/health.module';
import { ReadingsController } from './readings/readings.controller';
import { ReadingsModule } from './readings/readings.module';
import { RequestLoggingMiddleware } from './request-logging.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    HealthModule,
    ReadingsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes(ReadingsController);
  }
}
