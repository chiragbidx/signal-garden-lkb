import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { deals, organizations, contacts } from "@/lib/db/schema";
import DealsClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const session = await getAuthSession();
  if (!session) return redirect("/auth#signin");

  // Load user's teamId (using existing helper or session)
  const team = await db.query.teams.findFirst({
    where: (t) => t.members.some((m) => m.userId === session.userId),
  });
  if (!team) return redirect("/dashboard/team?error=No team found");

  // List deals for team, sorted by expected close date, then value
  const dealList = await db.query.deals.findMany({
    where: (d) => d.teamId === team.id,
    orderBy: [
      { expectedCloseDate: "asc" },
      { value: "desc" },
    ],
    with: {
      organization: true,
      contact: true,
      owner: true,
    },
  });

  // Get all organizations for filters and linking
  const orgs = await db.query.organizations.findMany({
    where: (o) => o.teamId === team.id,
    orderBy: [{ name: "asc" }],
  });

  // Get all contacts for linking/filter options
  const contactsList = await db.query.contacts.findMany({
    where: (c) => c.teamId === team.id,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  // All team members (for assignable owner)
  const members = await db.query.users.findMany({
    where: (u) => u.teamMemberships.some((m) => m.teamId === team.id),
    orderBy: [{ lastName: "asc" }],
  });

  return (
    <DealsClient
      deals={dealList}
      organizations={orgs}
      contacts={contactsList}
      members={members}
    />
  );
}