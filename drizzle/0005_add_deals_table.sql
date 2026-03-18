CREATE TABLE "deals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" uuid NOT NULL REFERENCES "teams"("id"),
  "owner_id" uuid NOT NULL REFERENCES "users"("id"),
  "title" varchar(160) NOT NULL,
  "value" integer,
  "currency" varchar(8),
  "status" varchar(24) NOT NULL,
  "organization_id" uuid REFERENCES "organizations"("id"),
  "contact_id" uuid REFERENCES "contacts"("id"),
  "expected_close_date" date,
  "description" text,
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "deals_team_idx" ON "deals" ("team_id");
CREATE INDEX "deals_organization_idx" ON "deals" ("organization_id");
CREATE INDEX "deals_contact_idx" ON "deals" ("contact_id");
CREATE INDEX "deals_owner_idx" ON "deals" ("owner_id");
CREATE INDEX "deals_status_idx" ON "deals" ("status");