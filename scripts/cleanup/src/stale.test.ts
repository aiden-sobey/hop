import { describe, expect, it } from 'vitest';
import { findStaleEnvironments, type PreviewEnvironment } from './stale.ts';

const now = new Date('2026-11-06T11:00:00Z');

function environment(name: string, commitTimestamp: string): PreviewEnvironment {
  return { name, commitSha: 'abc1234', commitTimestamp, deployedBy: 'someone' };
}

describe('findStaleEnvironments', () => {
  it('destroys environments older than the limit', () => {
    const old = environment('feat-old', '2026-10-20T09:00:00Z');
    expect(findStaleEnvironments([old], now, 7)).toEqual([old]);
  });

  it('keeps recent environments', () => {
    const fresh = environment('feat-new', '2026-11-04T09:00:00Z');
    expect(findStaleEnvironments([fresh], now, 7)).toEqual([]);
  });

  it('keeps long-lived environments', () => {
    const staging = environment('staging', '2026-08-01T09:00:00Z');
    expect(findStaleEnvironments([staging], now, 7)).toEqual([]);
  });
});
