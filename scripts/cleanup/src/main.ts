// Prints a JSON array of preview environment names to destroy.
// The cleanup workflow feeds this into a matrix of `terraform destroy` jobs.
import { ResourceGroupsTaggingAPIClient } from '@aws-sdk/client-resource-groups-tagging-api';
import { listPreviewEnvironments } from './environments.ts';
import { ageInDays, findStaleEnvironments } from './stale.ts';

const maxAgeDays = Number(process.env.MAX_AGE_DAYS ?? 7);
const now = new Date();

const client = new ResourceGroupsTaggingAPIClient({ region: process.env.AWS_REGION ?? 'ap-southeast-2' });
const environments = await listPreviewEnvironments(client);
const stale = findStaleEnvironments(environments, now, maxAgeDays);

for (const environment of environments) {
  const age = ageInDays(environment, now).toFixed(1);
  const verdict = stale.includes(environment) ? 'DESTROY' : 'keep';
  console.error(`${verdict.padEnd(7)} ${environment.name} (${age} days, ${environment.commitSha.slice(0, 7)}, ${environment.deployedBy})`);
}

console.log(JSON.stringify(stale.map((environment) => environment.name)));
