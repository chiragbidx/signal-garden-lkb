import { home } from "@/content/home";

export default function LayoutTeamSection() {
  const { team } = home;
  if (!team || team.length === 0) return null;

  return (
    <section
      id="layout-team"
      className="max-w-5xl mx-auto py-20 md:py-28 px-4"
    >
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-2">Meet the Team</h2>
        <p className="text-muted-foreground">
          The people building, supporting and improving PulseCRM for you.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 place-items-center">
        {team.map((member) => (
          <div
            key={member.email}
            className="flex flex-col items-center space-y-2"
          >
            {member.image && (
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full border object-cover"
              />
            )}
            <span className="font-semibold text-lg">{member.name}</span>
            <span className="text-sm text-muted-foreground">
              {member.role}
            </span>
            <span className="text-xs text-muted-foreground">{member.email}</span>
          </div>
        ))}
      </div>
    </section>
  );
}