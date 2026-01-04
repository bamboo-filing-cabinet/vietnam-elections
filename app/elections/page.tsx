import Link from "next/link";

const cycles = [
  {
    id: "na15-2021",
    name: "15th National Assembly (2021)",
    description:
      "Official candidate lists and constituencies for the 2021 National Assembly election.",
  },
];

export default function ElectionsPage() {
  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Elections</p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Election cycles</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600">
        Browse official candidate directories by cycle. Additional elections will be
        added over time.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-zinc-500">
        Danh sach ky bau cu theo tung giai doan. Se bo sung them khi co du lieu.
      </p>

      <div className="mt-6 grid gap-4">
        {cycles.map((cycle) => (
          <Link
            key={cycle.id}
            href={`/elections/${cycle.id}`}
            className="rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{cycle.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{cycle.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">View</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
