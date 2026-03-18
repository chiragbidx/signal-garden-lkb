import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { organizations, users } from "@/lib/db/schema";
import OrganizationsClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const session = await getAuthSession();
  if (!session) return redirect("/auth#signin");

  // Load user's teamId (using existing helper or from session)
  const team = await db.query.teams.findFirst({
    where: (t) => t.members.some((m) => m.userId === session.userId),
  });
  if (!team) return redirect("/dashboard/team?error=No team found");

  // List organizations for team, sorted by name
  const orgList = await db.query.organizations.findMany({
    where: (o) => o.teamId === team.id,
    orderBy: [{ name: "asc" }],
    with: {
      primaryContact: true,
    },
  });

  // All team members (for assignable primary contact)
  const members = await db.query.users.findMany({
    where: (u) => u.teamMemberships.some((m) => m.teamId === team.id),
    orderBy: [{ lastName: "asc" }],
  });

  // List contacts for primary contact selection and counting per org
  const contactsList = await db.query.contacts.findMany({
    where: (c) => c.teamId === team.id,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return (
    <OrganizationsClient
      organizations={orgList}
      contacts={contactsList}
      members={members}
    />
  );
}