import Link from "next/link";

const cycles = [
  {
    id: "na16-2026",
    name: "16th National Assembly (2026)",
    description: "Coming soon. Dataset and sources are not yet available.",
  },
  {
    id: "na15-2021",
    name: "15th National Assembly (2021)",
    description:
      "Official candidate lists and constituencies for the 2021 National Assembly election.",
  },
];

export default function ElectionsPage() {
  return (
    <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          Elections
        </p>
        <h1 className="text-3xl font-semibold text-[var(--ink)]">Election cycles</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
          Browse official candidate directories by cycle. Additional elections will be
          added over time.
        </p>
        <p className="max-w-2xl text-sm text-[var(--ink-muted)]">
          Danh sách kỳ bầu cử theo từng giai đoạn. Sẽ bổ sung thêm khi có dữ liệu.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cycles.map((cycle) => (
          <Link
            key={cycle.id}
            href={`/elections/${cycle.id}`}
            className="group rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{cycle.name}</p>
                <p className="mt-2 text-xs text-[var(--ink-muted)]">{cycle.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] group-hover:text-[var(--flag-red)]">
                View
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
