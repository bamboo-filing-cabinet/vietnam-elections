import Link from "next/link";

const cycles = [
  {
    id: "na15-2021",
    name: "15th National Assembly (2021)",
    description:
      "Official candidate lists and constituencies for the 2021 National Assembly election.",
  },
  {
    id: "na16-2026",
    name: "16th National Assembly (2026)",
    description: "Coming soon. Dataset and sources are not yet available.",
  },
];

export default function ElectionsPage() {
  return (
    <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Elections</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Election cycles</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Browse official candidate directories by cycle. Additional elections will be
          added over time.
        </p>
        <p className="max-w-2xl text-sm text-zinc-500">
          Danh sach ky bau cu theo tung giai doan. Se bo sung them khi co du lieu.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cycles.map((cycle) => (
          <Link
            key={cycle.id}
            href={`/elections/${cycle.id}`}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{cycle.name}</p>
                <p className="mt-2 text-xs text-zinc-500">{cycle.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-600">
                View
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
