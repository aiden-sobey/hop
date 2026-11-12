ALTER TABLE "readings" ADD COLUMN "source" text;--> statement-breakpoint
UPDATE "readings" SET "source" = 'meter' WHERE "source" IS NULL;--> statement-breakpoint
ALTER TABLE "readings" ALTER COLUMN "source" SET NOT NULL;
