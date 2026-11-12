// Loads 30 days of half-hourly readings for three tenants.
// northwind is the large customer: 2,000 meters, about 2.9 million readings.
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5433/readings';

const tenants = [
  { id: 'northwind', name: 'Northwind Utilities', meters: 2_000 },
  { id: 'fabrikam', name: 'Fabrikam Water', meters: 50 },
  { id: 'tailspin', name: 'Tailspin Energy', meters: 20 },
];

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  const started = Date.now();

  await client.query('truncate readings, meters, tenants restart identity cascade');

  for (const tenant of tenants) {
    await client.query('insert into tenants (id, name) values ($1, $2)', [tenant.id, tenant.name]);
    await client.query(
      `insert into meters (tenant_id, serial, site_name, installed_at)
       select $1, upper(left($1, 2)) || '-' || lpad(g::text, 6, '0'), 'Site ' || (g % 200 + 1), now() - interval '2 years'
       from generate_series(1, $2::int) as g`,
      [tenant.id, tenant.meters],
    );
    await client.query(
      `insert into readings (tenant_id, meter_id, recorded_at, value_kwh, source)
       select m.tenant_id, m.id, date_trunc('hour', now()) - (i * interval '30 minutes'), round((random() * 2)::numeric, 3), 'meter'
       from meters m cross join generate_series(0, 30 * 48 - 1) as i
       where m.tenant_id = $1`,
      [tenant.id],
    );
    console.log(`Seeded ${tenant.id}`);
  }

  await client.query('analyze');
  const { rows } = await client.query('select tenant_id, count(*)::int as readings from readings group by tenant_id order by 2 desc');
  console.table(rows);
  console.log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
