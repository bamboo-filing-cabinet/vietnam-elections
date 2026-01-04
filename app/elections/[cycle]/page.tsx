import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";

type TimelinePayload = {
  cycle_id: string;
  generated_at: string;
  cycle: {
    id: string;
    name: string;
    year: number;
    type: string;
    start_date: string | null;
    end_date: string | null;
    notes: string | null;
  };
};

type CandidatesIndexPayload = {
  cycle_id: string;
  generated_at: string;
  records: Array<{ entry_id: string }>;
};

const SUPPORTED_CYCLES = ["na15-2021"];

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function generateStaticParams() {
  return SUPPORTED_CYCLES.map((cycle) => ({ cycle }));
}

export default async function ElectionOverviewPage({
  params,
}: {
  params: Promise<{ cycle: string }>;
}) {
  const { cycle } = await params;
  if (!SUPPORTED_CYCLES.includes(cycle)) {
    notFound();
  }

  const baseDir = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    cycle
  );

  const timeline = await readJson<TimelinePayload>(
    path.join(baseDir, "timeline.json")
  );
  const candidates = await readJson<CandidatesIndexPayload>(
    path.join(baseDir, "candidates_index.json")
  );

  return (
    <div className="grid gap-8">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {timeline.cycle.year}
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-900">
          {timeline.cycle.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Official candidate directory and constituency references for this election cycle.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Thu muc ung cu vien va tai lieu don vi bau cu cho ky bau cu nay.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Candidates</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {candidates.records.length.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Generated</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {new Date(candidates.generated_at).toLocaleDateString("en-US")}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Cycle ID</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">{timeline.cycle.id}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Explore</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href={`/elections/${cycle}/candidates`}
            className="rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-zinc-900">Candidate directory</p>
            <p className="mt-2 text-xs text-zinc-500">Search and filter official entries.</p>
          </Link>
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-xs text-zinc-500">
            Constituencies, documents, and timeline pages will appear here.
          </div>
        </div>
      </section>
    </div>
  );
}
