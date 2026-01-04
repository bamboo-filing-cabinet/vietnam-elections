import Link from "next/link";

const cycles = [
  { id: "na16-2026", name: "NA16 (2026)" },
  { id: "na15-2021", name: "NA15 (2021)" },
];

export default function CycleNav({ cycle }: { cycle: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--ink-muted)]">
      <div className="flex items-center gap-2">
        <Link className="text-[var(--ink-muted)] hover:text-[var(--ink)]" href="/elections">
          Elections
        </Link>
        <span className="text-[var(--ink-muted)]">/</span>
        <span className="font-semibold text-[var(--ink)]">{cycle}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cycles.map((item) => (
          <Link
            key={item.id}
            href={`/elections/${item.id}`}
            style={
              item.id === cycle
                ? {
                    backgroundColor: "var(--flag-red)",
                    borderColor: "var(--flag-red)",
                    color: "var(--flag-yellow)",
                  }
                : undefined
            }
            className={`rounded-full border px-3 py-1 transition ${
              item.id === cycle
                ? "font-semibold shadow-[0_6px_14px_-8px_rgba(255,222,0,0.9)] ring-1 ring-[var(--flag-yellow)]/70"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
