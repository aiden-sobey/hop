import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../logger';

export async function runMigrations(): Promise<void> {
  const pool = new Pool({ connectionString: config.databaseUrl, max: 1 });
  try {
    logger.info('Running database migrations');
    await migrate(drizzle(pool), {
      migrationsFolder: path.join(__dirname, '..', '..', 'drizzle'),
    });
    logger.info('Database migrations complete');
  } finally {
    await pool.end();
  }
}
