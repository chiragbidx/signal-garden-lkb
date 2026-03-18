"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activities } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

const activitySchema = z.object({
  type: z.enum(["call", "meeting", "email", "note", "task"]),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  dateTime: z.string().min(1, "Date/time required"),
  contactId: z.string().optional(),
  organizationId: z.string().optional(),
  dealId: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createActivity(data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = activitySchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  const teamId = session.teamId;
  const res = await db.insert(activities).values({
    ...parsed.data,
    teamId,
    ownerId: session.userId,
    dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
  }).returning();

  return { success: true, activity: res[0] };
}

export async function updateActivity(id: string, data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const row = await db.query.activities.findFirst({ where: (a) => a.id === id });
  if (!row) throw new Error("Activity not found.");
  if (row.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin
  if (row.ownerId !== session.userId && !session.isAdmin)
    throw new Error("Insufficient permission.");

  const parsed = activitySchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  await db.update(activities).set({
    ...parsed.data,
    dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
  }).where({ id });

  return { success: true };
}

export async function deleteActivity(id: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  const row = await db.query.activities.findFirst({ where: (a) => a.id === id });
  if (!row) throw new Error("Activity not found.");
  if (row.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin
  if (row.ownerId !== session.userId && !session.isAdmin)
    throw new Error("Insufficient permission.");

  await db.delete(activities).where({ id });

  return { success: true };
}