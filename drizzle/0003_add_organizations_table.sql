CREATE TABLE "organizations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" uuid NOT NULL REFERENCES "teams"("id"),
  "name" varchar(120) NOT NULL,
  "domain" varchar(120) NOT NULL,
  "address" text,
  "description" text,
  "industry" varchar(120),
  "tags" text,
  "primary_contact_id" uuid REFERENCES "contacts"("id"),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "organization_team_domain_unique" UNIQUE("team_id", "domain")
);

CREATE INDEX "organization_team_idx" ON "organizations" ("team_id");
CREATE INDEX "organization_primary_contact_idx" ON "organizations" ("primary_contact_id");