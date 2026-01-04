import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";

type CandidateDetailPayload = {
  entry_id: string;
  cycle_id: string;
  person: {
    full_name: string;
    dob: string | null;
    gender: string | null;
    nationality: string | null;
    ethnicity: string | null;
    religion: string | null;
    birthplace: string | null;
    current_residence: string | null;
  };
  entry: {
    list_order: number | null;
    party_member_since: string | null;
    is_na_delegate: string | null;
    is_council_delegate: string | null;
  };
  locality: {
    id: string;
    name_vi: string;
    name_folded: string;
    type: string;
  } | null;
  constituency: {
    id: string;
    locality_id: string;
    unit_number: number;
    seat_count: number;
    name_vi: string;
    name_folded: string;
    description: string | null;
    unit_context_raw: string | null;
    districts: Array<{ name_vi: string; name_folded: string }>;
  } | null;
  attributes: Array<{ key: string; value: string }>;
  sources: Array<{
    field: string;
    document_id: string;
    title: string;
    url: string | null;
    doc_type: string | null;
    published_date: string | null;
    fetched_date: string | null;
    notes: string | null;
  }>;
  changelog: Array<{ change_type: string; changed_at: string; summary: string | null }>;
};

const SUPPORTED_CYCLES = ["na15-2021"];

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function generateStaticParams() {
  const cycle = "na15-2021";
  const detailDir = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    cycle,
    "candidates_detail"
  );
  const files = await fs.readdir(detailDir);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      cycle,
      entryId: file.replace(/\.json$/, ""),
    }));
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US");
}

function latestFetchedDate(sources: CandidateDetailPayload["sources"]): string {
  const dates = sources
    .map((source) => source.fetched_date)
    .filter(Boolean)
    .map((value) => new Date(value as string))
    .filter((value) => !Number.isNaN(value.getTime()));
  if (dates.length === 0) {
    return "Unknown";
  }
  const latest = dates.sort((a, b) => b.getTime() - a.getTime())[0];
  return latest.toLocaleDateString("en-US");
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ cycle: string; entryId: string }>;
}) {
  const { cycle, entryId } = await params;
  if (!SUPPORTED_CYCLES.includes(cycle)) {
    notFound();
  }

  const detailPath = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    cycle,
    "candidates_detail",
    `${entryId}.json`
  );

  try {
    await fs.access(detailPath);
  } catch {
    notFound();
  }

  const payload = await readJson<CandidateDetailPayload>(detailPath);

  return (
    <div className="grid gap-6">
      <Link
        href={`/elections/${cycle}/candidates`}
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
      >
        Back to candidates
      </Link>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{cycle}</p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-900">
          {payload.person.full_name}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {payload.locality?.name_vi ?? "Unknown locality"} ·{" "}
          {payload.constituency?.name_vi ?? "Unknown constituency"}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">List order</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {payload.entry.list_order ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Last updated</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {latestFetchedDate(payload.sources)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Date of birth</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {payload.person.dob ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Profile</h2>
        <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Gender</span>
            <p className="mt-1">{payload.person.gender ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Nationality</span>
            <p className="mt-1">{payload.person.nationality ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Ethnicity</span>
            <p className="mt-1">{payload.person.ethnicity ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Religion</span>
            <p className="mt-1">{payload.person.religion ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Birthplace</span>
            <p className="mt-1">{payload.person.birthplace ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Residence</span>
            <p className="mt-1">{payload.person.current_residence ?? "—"}</p>
          </div>
        </div>
      </section>

      {payload.attributes.length > 0 && (
        <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Attributes</h2>
          <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            {payload.attributes.map((attr) => (
              <div key={attr.key}>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {attr.key.replace(/_/g, " ")}
                </span>
                <p className="mt-1">{attr.value || "—"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Sources</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Each field is tied to an official document. Links below reference the source
          documents used for this entry.
        </p>
        <div className="mt-4 grid gap-3">
          {payload.sources.map((source) => (
            <a
              key={`${source.document_id}-${source.field}`}
              href={source.url ?? "#"}
              className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-zinc-900">{source.title}</span>
                <span className="text-xs text-zinc-500">
                  Field: {source.field} · Fetched: {formatDate(source.fetched_date)}
                </span>
              </div>
            </a>
          ))}
          {payload.sources.length === 0 && (
            <p className="text-sm text-zinc-500">No sources listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
