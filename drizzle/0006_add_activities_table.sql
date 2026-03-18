CREATE TABLE "activities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" uuid NOT NULL REFERENCES "teams"("id"),
  "owner_id" uuid NOT NULL REFERENCES "users"("id"),
  "type" varchar(24) NOT NULL,
  "subject" varchar(160) NOT NULL,
  "description" text,
  "date_time" timestamptz NOT NULL,
  "contact_id" uuid REFERENCES "contacts"("id"),
  "organization_id" uuid REFERENCES "organizations"("id"),
  "deal_id" uuid REFERENCES "deals"("id"),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "activities_team_idx" ON "activities" ("team_id");
CREATE INDEX "activities_owner_idx" ON "activities" ("owner_id");
CREATE INDEX "activities_contact_idx" ON "activities" ("contact_id");
CREATE INDEX "activities_organization_idx" ON "activities" ("organization_id");
CREATE INDEX "activities_deal_idx" ON "activities" ("deal_id");
CREATE INDEX "activities_date_time_idx" ON "activities" ("date_time");