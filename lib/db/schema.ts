import {
  pgTable,
  serial,
  text,
  uuid,
  timestamp,
  varchar,
  integer,
  jsonb,
  date,
  unique,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

export * from "./base-schema";

// Existing tables...

// New PulseCRM Entities

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  name: varchar("name", { length: 120 }).notNull(),
  domain: varchar("domain", { length: 120 }).notNull(),
  address: text("address"),
  description: text("description"),
  industry: varchar("industry", { length: 120 }),
  tags: text("tags"),
  primaryContactId: uuid("primary_contact_id").references(() => contacts.id), // circular; migration will handle ordering
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
},
  (org) => ({
    teamDomainUnique: unique("organization_team_domain_unique").on(org.teamId, org.domain),
    teamIdx: index("organization_team_idx").on(org.teamId),
    primaryContactIdx: index("organization_primary_contact_idx").on(org.primaryContactId),
  })
);

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  jobTitle: varchar("job_title", { length: 64 }),
  organizationId: uuid("organization_id").references(() => organizations.id),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
},
  (contact) => ({
    teamEmailUnique: unique("contacts_team_email_unique").on(contact.teamId, contact.email),
    teamIdx: index("contacts_team_idx").on(contact.teamId),
    organizationIdx: index("contacts_organization_idx").on(contact.organizationId),
    ownerIdx: index("contacts_owner_idx").on(contact.ownerId),
  })
);

export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  title: varchar("title", { length: 160 }).notNull(),
  value: integer("value"),
  currency: varchar("currency", { length: 8 }),
  status: varchar("status", { length: 24 }).notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  expectedCloseDate: date("expected_close_date"),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
},
  (deal) => ({
    teamIdx: index("deals_team_idx").on(deal.teamId),
    organizationIdx: index("deals_organization_idx").on(deal.organizationId),
    contactIdx: index("deals_contact_idx").on(deal.contactId),
    ownerIdx: index("deals_owner_idx").on(deal.ownerId),
    statusIdx: index("deals_status_idx").on(deal.status),
  })
);

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  type: varchar("type", { length: 24 }).notNull(),
  subject: varchar("subject", { length: 160 }).notNull(),
  description: text("description"),
  dateTime: timestamp("date_time", { withTimezone: true }).notNull(),
  contactId: uuid("contact_id").references(() => contacts.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  dealId: uuid("deal_id").references(() => deals.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
},
  (activity) => ({
    teamIdx: index("activities_team_idx").on(activity.teamId),
    ownerIdx: index("activities_owner_idx").on(activity.ownerId),
    contactIdx: index("activities_contact_idx").on(activity.contactId),
    organizationIdx: index("activities_organization_idx").on(activity.organizationId),
    dealIdx: index("activities_deal_idx").on(activity.dealId),
    dateTimeIdx: index("activities_date_time_idx").on(activity.dateTime),
  })
);