import { FileText, FlaskConical, Play, Wrench } from "lucide-react";

interface StatsBarProps {
  writeups: number;
  labs: number;
  demos: number;
  tools: number;
  total: number;
}

const statConfig = [
  { key: "writeups" as const, label: "Write-ups", icon: FileText },
  { key: "labs" as const, label: "Labs", icon: FlaskConical },
  { key: "demos" as const, label: "Demos", icon: Play },
  { key: "tools" as const, label: "Tools", icon: Wrench },
] as const;

export function StatsBar({ writeups, labs, demos, tools, total }: StatsBarProps) {
  const counts = { writeups, labs, demos, tools };

  return (
    <section
      aria-label="Content statistics"
      className="border-b border-border bg-card px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 sm:gap-10">
        {statConfig.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-2">
            <Icon className="size-4 text-primary" aria-hidden="true" />
            <span className="font-mono text-xl font-bold text-foreground tabular-nums">
              {counts[key]}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{label}</span>
          </div>
        ))}

        <div className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-primary tabular-nums">
            {total}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Total resources
          </span>
        </div>
      </div>
    </section>
  );
}
