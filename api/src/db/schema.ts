import {
  bigserial,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const meters = pgTable('meters', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id')
    .notNull()
    .references(() => tenants.id),
  serial: text('serial').notNull(),
  siteName: text('site_name').notNull(),
  installedAt: timestamp('installed_at', { withTimezone: true }).notNull(),
});

export const readings = pgTable(
  'readings',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id),
    meterId: integer('meter_id')
      .notNull()
      .references(() => meters.id),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull(),
    valueKwh: doublePrecision('value_kwh').notNull(),
    source: text('source').notNull(),
  },
  (table) => [index('readings_meter_id_idx').on(table.meterId)],
);

export type Meter = typeof meters.$inferSelect;
export type Reading = typeof readings.$inferSelect;
