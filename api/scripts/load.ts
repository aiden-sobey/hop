// Simulates the dashboard: each user loads the "Last 30 days" view for a tenant,
// while the load balancer checks /health every 2 seconds.
//
//   pnpm load                      # northwind, 3 concurrent users
//   pnpm load fabrikam 10          # tenant, concurrent users
import { parseArgs } from 'node:util';

const { positionals } = parseArgs({ allowPositionals: true });
const tenant = positionals[0] ?? 'northwind';
const users = Number(positionals[1] ?? 3);
const baseUrl = process.env.API_URL ?? 'http://localhost:3000';

async function dashboardRequest(user: number) {
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const started = Date.now();
  try {
    const response = await fetch(`${baseUrl}/tenants/${tenant}/readings?from=${from}`);
    const body = await response.text();
    console.log(`user ${user}: ${response.status} in ${Date.now() - started}ms (${(body.length / 1e6).toFixed(1)} MB)`);
  } catch (error) {
    console.log(`user ${user}: failed after ${Date.now() - started}ms (${(error as Error).cause ?? error})`);
  }
}

async function healthCheck() {
  const started = Date.now();
  try {
    const response = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(5_000) });
    console.log(`  /health: ${response.status} in ${Date.now() - started}ms`);
  } catch (error) {
    console.log(`  /health: failed after ${Date.now() - started}ms (${(error as Error).name})`);
  }
}

async function main() {
  console.log(`${users} users loading ${tenant} from ${baseUrl}`);
  const health = setInterval(healthCheck, 2_000);
  await Promise.all(Array.from({ length: users }, (_, i) => dashboardRequest(i + 1)));
  clearInterval(health);
}

main();
