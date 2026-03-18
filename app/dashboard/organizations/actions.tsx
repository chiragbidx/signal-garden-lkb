"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { organizations } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  address: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  tags: z.string().optional(),
  primaryContactId: z.string().optional(),
});

export async function createOrganization(data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = organizationSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  // Validate org domain uniqueness per team
  const teamId = session.teamId;
  const existing = await db.query.organizations.findFirst({
    where: (o) => o.teamId === teamId && o.domain === data.domain,
  });
  if (existing) throw new Error("An organization with this domain already exists for this team.");

  const res = await db.insert(organizations).values({
    ...parsed.data,
    teamId,
  }).returning();

  return { success: true, organization: res[0] };
}

export async function updateOrganization(id: string, data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const org = await db.query.organizations.findFirst({ where: (o) => o.id === id });
  if (!org) throw new Error("Organization not found.");
  if (org.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only admin can update
  if (!session.isAdmin) throw new Error("Insufficient permission.");

  const parsed = organizationSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  // Uniqueness if changing domain
  if (data.domain && data.domain !== org.domain) {
    const existing = await db.query.organizations.findFirst({
      where: (o) => o.teamId === session.teamId && o.domain === data.domain,
    });
    if (existing) throw new Error("An organization with this domain already exists for this team.");
  }

  await db.update(organizations).set(parsed.data).where({ id });

  return { success: true };
}

export async function deleteOrganization(id: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  const org = await db.query.organizations.findFirst({ where: (o) => o.id === id });
  if (!org) throw new Error("Organization not found.");
  if (org.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only admin can delete
  if (!session.isAdmin) throw new Error("Insufficient permission.");

  // Deleting org should only unlink (not delete) contacts and deals
  await db.update("contacts").set({ organizationId: null }).where({ organizationId: org.id });
  await db.update("deals").set({ organizationId: null }).where({ organizationId: org.id });
  await db.delete(organizations).where({ id });

  return { success: true };
}