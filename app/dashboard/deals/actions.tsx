"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { deals } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.number(),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum(["New", "Qualified", "Proposal", "Won", "Lost"]),
  organizationId: z.string().optional(),
  contactId: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createDeal(data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = dealSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  const teamId = session.teamId;
  const res = await db.insert(deals).values({
    ...parsed.data,
    teamId,
    ownerId: session.userId,
    expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
  }).returning();

  return { success: true, deal: res[0] };
}

export async function updateDeal(id: string, data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const dealRow = await db.query.deals.findFirst({ where: (d) => d.id === id });
  if (!dealRow) throw new Error("Deal not found.");
  if (dealRow.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin
  if (dealRow.ownerId !== session.userId && !session.isAdmin)
    throw new Error("Insufficient permission.");

  const parsed = dealSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  await db.update(deals).set({
    ...parsed.data,
    expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
  }).where({ id });

  return { success: true };
}

export async function deleteDeal(id: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  const dealRow = await db.query.deals.findFirst({ where: (d) => d.id === id });
  if (!dealRow) throw new Error("Deal not found.");
  if (dealRow.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin
  if (dealRow.ownerId !== session.userId && !session.isAdmin)
    throw new Error("Insufficient permission.");

  await db.delete(deals).where({ id });

  return { success: true };
}