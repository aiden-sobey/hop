import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, asc, eq, gte, lte } from 'drizzle-orm';
import { Database, DB } from '../db/database.module';
import { Meter, meters, readings } from '../db/schema';

export interface ReadingWithMeter {
  id: number;
  meterId: number;
  recordedAt: Date;
  valueKwh: number;
  source: string;
  meter: { serial: string; siteName: string };
}

@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(@Inject(DB) private readonly db: Database) {}

  async listForTenant(tenantId: string, from?: Date, to?: Date): Promise<ReadingWithMeter[]> {
    const conditions = [eq(readings.tenantId, tenantId)];
    if (from) conditions.push(gte(readings.recordedAt, from));
    if (to) conditions.push(lte(readings.recordedAt, to));

    const rows = await this.db
      .select()
      .from(readings)
      .where(and(...conditions))
      .orderBy(asc(readings.recordedAt));
    this.logger.debug(`Loaded ${rows.length} readings for tenant ${tenantId}`);

    const meterCache = new Map<number, Meter>();
    const result: ReadingWithMeter[] = [];
    for (const row of rows) {
      let meter = meterCache.get(row.meterId);
      if (!meter) {
        this.logger.debug(`Fetching meter ${row.meterId} for tenant ${tenantId}`);
        [meter] = await this.db.select().from(meters).where(eq(meters.id, row.meterId));
        meterCache.set(row.meterId, meter);
      }
      result.push({
        id: row.id,
        meterId: row.meterId,
        recordedAt: row.recordedAt,
        valueKwh: row.valueKwh,
        source: row.source,
        meter: { serial: meter.serial, siteName: meter.siteName },
      });
    }
    return result;
  }
}
