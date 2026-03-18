import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { contacts, organizations, users } from "@/lib/db/schema";
import ContactsClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const session = await getAuthSession();
  if (!session) return redirect("/auth#signin");

  // Load user's teamId (using existing helper or from session)
  const team = await db.query.teams.findFirst({
    where: (t) => t.members.some((m) => m.userId === session.userId),
  });
  if (!team) return redirect("/dashboard/team?error=No team found");

  // List contacts for team, sorted by last, then first name
  const contactList = await db.query.contacts.findMany({
    where: (c) => c.teamId === team.id,
    orderBy: [
      { lastName: "asc" },
      { firstName: "asc" },
    ],
    with: {
      organization: true,
      owner: true,
    },
  });

  // Also load orgs for filters
  const orgs = await db.query.organizations.findMany({
    where: (o) => o.teamId === team.id,
    orderBy: [{ name: "asc" }],
  });

  // All team members (for filters/owner assignment)
  const members = await db.query.users.findMany({
    where: (u) => u.teamMemberships.some((m) => m.teamId === team.id),
    orderBy: [{ lastName: "asc" }],
  });

  return (
    <ContactsClient
      contacts={contactList}
      organizations={orgs}
      members={members}
    />
  );
}