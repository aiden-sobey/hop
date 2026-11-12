# Demo environment deleted by the preview cleanup

Reported Monday 9 November by Jordan (Sales).

## What happened

Jordan opened `https://demo.preview.acme-readings.example` before a customer call and got a DNS error. The demo environment was gone.

The demo environment is a long-lived preview environment built from the `demo` branch. Sales use it for customer demos and have loaded their own demo data into it by hand since June. Priya redeployed it on Wednesday 4 November, by re-running the preview workflow on the `demo` branch, so that it had the latest build for a customer visit.

The preview cleanup ran on Friday 6 November at 10pm and destroyed it. The log from that run is in [`cleanup-run.log`](cleanup-run.log).

## Impact

- No demo environment from Friday night until Monday afternoon. One customer demo was rescheduled.
- The demo database is gone. The RDS automated backups were deleted with the instance, so there was nothing to restore from.
- Sales are re-entering their demo data by hand.

## What we did

- Re-ran the preview workflow on the `demo` branch to recreate the environment.

## Open questions

- Why did the cleanup decide `demo` was stale?
- How do we make sure this can't happen again?
