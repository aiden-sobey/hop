# Acme Telemetry: a platform exercise

Acme Telemetry is a fictional company. It collects half-hourly readings from its customers' field meters, and customers look at them in a web dashboard.
This repo serves the `readings-api` that sits behind the dashboard.


## Your task

The team has asked for help with two problems:

1. **API tasks keep restarting in production.** See [`incidents/2026-11-10-api-restarts`](incidents/2026-11-10-api-restarts/README.md).
2. **The weekly cleanup deleted the demo environment.** See [`incidents/2026-11-09-demo-environment-deleted`](incidents/2026-11-09-demo-environment-deleted/README.md).


Find the cause of each problem, fix what you can in the repo, and tell us how you would roll the fix out.

The repo has other problems too, and some are more serious than others. You won't have time to fix all of them. As you go, keep a list of what you notice.

At the end, tell us what you would fix next and why.

## How we'll work

- The session is about 60 minutes. Share your screen and talk us through your thinking.
- Use the tools you normally use to solve problems.
- Ask us anything. We'll answer as the rest of the team would.
- We care more about how you work than about how much you finish.

## What's in the repo

| Path | What it is |
| --- | --- |
| `api/` | `readings-api`: NestJS on Node 22, Drizzle ORM, Postgres |
| `infra/modules/environment/` | Terraform for one environment: VPC, load balancer, ECS Fargate service, RDS Postgres, S3 bucket for exports |
| `infra/environments/` | Terraform roots: `shared` (container registry), `prod`, and `preview` (one workspace per branch) |
| `.github/workflows/` | CI, the production deploy, preview environments and the weekly preview cleanup |
| `scripts/cleanup/` | The script the cleanup workflow runs to choose which preview environments to destroy |
| `incidents/` | Notes and logs from recent incidents |
| `docs/` | Other team documents |

Every branch gets its own preview environment. A merge to `main` deploys to production.

## Run it locally

You need Docker, Node 22 with pnpm 10 (`corepack enable` sets it up). Terraform >= 1.10 is optional, for syntax checking.

Start Postgres and the API. The API listens on port 3000 and Postgres on port 5433.

```bash
docker compose up -d --build
```

Seed test data. Adds three customers with 30 days of readings.

```bash
cd api
pnpm install
pnpm seed
```

Simulate dashboard traffic. Sends API requests to Docker the way the dashboard would when pulling last 30 days of readings.
Follows with health checks.
Arguments are optional.

```bash
pnpm load
pnpm load fabrikam 5
```

Run the cleanup script's tests:

```bash
cd scripts/cleanup
pnpm install
pnpm test
```

(Optional) You can validate TF syntax:

```bash
cd infra/environments/preview
terraform init -backend=false
terraform validate
```
