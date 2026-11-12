import {
  GetResourcesCommand,
  ResourceGroupsTaggingAPIClient,
} from '@aws-sdk/client-resource-groups-tagging-api';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { listPreviewEnvironments } from './environments.ts';

const taggingApi = mockClient(ResourceGroupsTaggingAPIClient);

beforeEach(() => taggingApi.reset());

describe('listPreviewEnvironments', () => {
  it('reads the environment from the ECS service tags', async () => {
    taggingApi.on(GetResourcesCommand).resolves({
      ResourceTagMappingList: [
        {
          ResourceARN: 'arn:aws:ecs:ap-southeast-2:111122223333:service/readings-feat-x/readings-api-feat-x',
          Tags: [
            { Key: 'Environment', Value: 'feat-x' },
            { Key: 'CommitSha', Value: '9f2c1e7' },
            { Key: 'CommitTimestamp', Value: '2026-11-02T03:15:00Z' },
            { Key: 'DeployedBy', Value: 'jlee' },
          ],
        },
      ],
    });

    const environments = await listPreviewEnvironments(new ResourceGroupsTaggingAPIClient({}));

    expect(environments).toEqual([
      { name: 'feat-x', commitSha: '9f2c1e7', commitTimestamp: '2026-11-02T03:15:00Z', deployedBy: 'jlee' },
    ]);
  });
});
