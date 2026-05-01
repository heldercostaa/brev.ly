CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code"),
	CONSTRAINT "short_code_check" CHECK ("links"."short_code" ~ '^[a-zA-Z0-9_-]+$')
);
--> statement-breakpoint
CREATE INDEX "short_code_idx" ON "links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "links" USING btree ("created_at");