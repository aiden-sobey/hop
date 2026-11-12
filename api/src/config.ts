export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5433/readings',
  logLevel: process.env.LOG_LEVEL ?? 'debug',
  exportsBucket: process.env.EXPORTS_BUCKET,
};
