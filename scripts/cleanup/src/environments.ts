import {
  GetResourcesCommand,
  ResourceGroupsTaggingAPIClient,
  type ResourceTagMapping,
} from '@aws-sdk/client-resource-groups-tagging-api';
import type { PreviewEnvironment } from './stale.ts';

// Each preview environment runs one ECS service, tagged by Terraform with the
// commit it was deployed from.
export async function listPreviewEnvironments(
  client: ResourceGroupsTaggingAPIClient,
): Promise<PreviewEnvironment[]> {
  const environments: PreviewEnvironment[] = [];
  let paginationToken: string | undefined;

  do {
    const page = await client.send(
      new GetResourcesCommand({
        ResourceTypeFilters: ['ecs:service'],
        TagFilters: [{ Key: 'Stage', Values: ['preview'] }],
        PaginationToken: paginationToken,
      }),
    );
    for (const resource of page.ResourceTagMappingList ?? []) {
      environments.push(toEnvironment(resource));
    }
    paginationToken = page.PaginationToken || undefined;
  } while (paginationToken);

  return environments;
}

function toEnvironment(resource: ResourceTagMapping): PreviewEnvironment {
  const tags = Object.fromEntries((resource.Tags ?? []).map((tag) => [tag.Key, tag.Value]));
  return {
    name: tags.Environment ?? '',
    commitSha: tags.CommitSha ?? '',
    commitTimestamp: tags.CommitTimestamp ?? '',
    deployedBy: tags.DeployedBy ?? '',
  };
}
