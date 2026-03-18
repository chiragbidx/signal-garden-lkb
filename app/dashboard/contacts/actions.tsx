"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { contacts, organizations, users } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  organizationId: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createContact(data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  // Validate unique email per team
  const teamId = session.teamId;
  const existing = await db.query.contacts.findFirst({
    where: (c) => c.teamId === teamId && c.email === data.email,
  });
  if (existing) throw new Error("A contact with this email already exists for this team.");

  const res = await db.insert(contacts).values({
    ...parsed.data,
    teamId,
    ownerId: session.userId,
  }).returning();

  return { success: true, contact: res[0] };
}

export async function updateContact(id: string, data: any) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const contactRow = await db.query.contacts.findFirst({ where: (c) => c.id === id });
  if (!contactRow) throw new Error("Contact not found.");
  if (contactRow.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin can update
  if (contactRow.ownerId !== session.userId && !session.isAdmin) throw new Error("Insufficient permission.");

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  // Enforce email uniqueness if changing email
  if (data.email && data.email !== contactRow.email) {
    const existing = await db.query.contacts.findFirst({
      where: (c) => c.teamId === session.teamId && c.email === data.email,
    });
    if (existing) throw new Error("A contact with this email already exists for this team.");
  }

  await db.update(contacts).set(parsed.data).where({ id });

  return { success: true };
}

export async function deleteContact(id: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  const contactRow = await db.query.contacts.findFirst({ where: (c) => c.id === id });
  if (!contactRow) throw new Error("Contact not found.");
  if (contactRow.teamId !== session.teamId) throw new Error("Forbidden.");

  // Only owner or admin can delete
  if (contactRow.ownerId !== session.userId && !session.isAdmin) throw new Error("Insufficient permission.");

  await db.delete(contacts).where({ id });

  return { success: true };
}