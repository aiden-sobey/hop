export interface PreviewEnvironment {
  name: string;
  commitSha: string;
  commitTimestamp: string;
  deployedBy: string;
}

// Long-lived environments that must never be cleaned up.
export const KEEP = ['main', 'staging'];

const DAY_MS = 24 * 60 * 60 * 1000;

export function ageInDays(environment: PreviewEnvironment, now: Date): number {
  return (now.getTime() - new Date(environment.commitTimestamp).getTime()) / DAY_MS;
}

export function findStaleEnvironments(
  environments: PreviewEnvironment[],
  now: Date,
  maxAgeDays: number,
): PreviewEnvironment[] {
  return environments.filter((environment) => {
    if (KEEP.includes(environment.name)) return false;
    return ageInDays(environment, now) > maxAgeDays;
  });
}
