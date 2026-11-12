import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const started = Date.now();
    const request = `${req.method} ${req.originalUrl}`;
    this.logger.log(`${request} started`);

    res.on('close', () => {
      const duration = Date.now() - started;
      if (res.writableFinished) {
        this.logger.log(`${request} ${res.statusCode} in ${duration}ms`);
      } else {
        this.logger.warn(`${request} aborted by the client after ${duration}ms`);
      }
    });

    next();
  }
}
