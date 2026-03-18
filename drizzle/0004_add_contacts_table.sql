CREATE TABLE "contacts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" uuid NOT NULL REFERENCES "teams"("id"),
  "owner_id" uuid NOT NULL REFERENCES "users"("id"),
  "first_name" varchar(64) NOT NULL,
  "last_name" varchar(64) NOT NULL,
  "email" varchar(160) NOT NULL,
  "phone" varchar(40),
  "job_title" varchar(64),
  "organization_id" uuid REFERENCES "organizations"("id"),
  "tags" text,
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "contacts_team_email_unique" UNIQUE("team_id", "email")
);

CREATE INDEX "contacts_team_idx" ON "contacts" ("team_id");
CREATE INDEX "contacts_organization_idx" ON "contacts" ("organization_id");
CREATE INDEX "contacts_owner_idx" ON "contacts" ("owner_id");