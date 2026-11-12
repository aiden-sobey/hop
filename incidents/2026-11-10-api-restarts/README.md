# API tasks restarting in production

Reported Tuesday 10 November by Northwind's support contact. Still happening.

## What happened

Northwind is our largest customer, with about 2,000 meters. Since Tuesday morning their dashboard's "Last 30 days" view often fails with a 502 or 503. Other customers saw errors at the same times, even though their own dashboards are small.

ECS is replacing the API tasks over and over, and often all of them at once.

## What we have

- [`ecs-service-events.log`](ecs-service-events.log): ECS service events for `readings-api-prod`, from our EventBridge archive.
- [`stopped-tasks.txt`](stopped-tasks.txt): the stop reasons for one round of restarts on Wednesday morning.
- [`api-logs.txt`](api-logs.txt): a few API log lines from around the same time.

## What we did

- On Tuesday afternoon the on-call engineer raised the service's desired count from 3 to 6 in the console. The restarts continued.

## Other notes

- The dashboard team mentioned that the `source` field on readings, which they asked for in October, still isn't in the API response. Probably unrelated. They've raised a separate ticket.
