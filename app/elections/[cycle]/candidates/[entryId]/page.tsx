import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CycleNav from "../../CycleNav";

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

const ATTRIBUTE_LABELS: Record<string, { en: string; vi: string }> = {
  education_general: {
    en: "General education",
    vi: "Giáo dục phổ thông",
  },
  education_professional: {
    en: "Professional training",
    vi: "Chuyên môn, nghiệp vụ",
  },
  education_academic_rank: {
    en: "Academic rank/degree",
    vi: "Học hàm, học vị",
  },
  education_political: {
    en: "Political theory",
    vi: "Lý luận chính trị",
  },
  education_languages: {
    en: "Foreign languages",
    vi: "Ngoại ngữ",
  },
  occupation_title: {
    en: "Occupation/position",
    vi: "Nghề nghiệp, chức vụ",
  },
  workplace: {
    en: "Workplace",
    vi: "Nơi công tác",
  },
};

const SUPPORTED_CYCLES = ["na15-2021"];

function groupSources(
  sources: CandidateDetailPayload["sources"]
): Array<{ title: string; items: CandidateDetailPayload["sources"] }> {
  const map = new Map<string, CandidateDetailPayload["sources"]>();
  sources.forEach((source) => {
    const key = source.title || "Untitled document";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(source);
  });
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
}

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
    <div className="grid gap-6 stagger">
      <CycleNav cycle={cycle} />
      <Link
        href={`/elections/${cycle}/candidates`}
        className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
      >
        Back to candidates
      </Link>

      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">{cycle}</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
          {payload.person.full_name}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          {payload.locality?.name_vi ?? "Unknown locality"} ·{" "}
          {payload.constituency?.name_vi ?? "Unknown constituency"}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">List order</p>
            <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
              {payload.entry.list_order ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Last updated</p>
            <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
              {latestFetchedDate(payload.sources)}
            </p>
          </div>
          <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Date of birth</p>
            <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
              {payload.person.dob ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Profile</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Hồ sơ ứng cử viên
        </p>
        <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Gender</span>
            <p className="mt-1">{payload.person.gender ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Nationality</span>
            <p className="mt-1">{payload.person.nationality ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Ethnicity</span>
            <p className="mt-1">{payload.person.ethnicity ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Religion</span>
            <p className="mt-1">{payload.person.religion ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Birthplace</span>
            <p className="mt-1">{payload.person.birthplace ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Residence</span>
            <p className="mt-1">{payload.person.current_residence ?? "—"}</p>
          </div>
        </div>
      </section>

      {payload.attributes.length > 0 && (
        <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Attributes</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
            Thông tin bổ sung
          </p>
          <p className="mt-3 text-xs text-[var(--ink-muted)]">
            Note: General education uses the Vietnamese grade system (12/12 = completed
            high school; 10/10 = older system).
          </p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2">
            {payload.attributes.map((attr) => {
              const label = ATTRIBUTE_LABELS[attr.key];
              return (
                <div key={attr.key}>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                    {label ? `${label.en} · ${label.vi}` : attr.key.replace(/_/g, " ")}
                  </span>
                  <p className="mt-1">{attr.value || "—"}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Sources</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Nguồn tài liệu
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Each field is tied to an official document. Links below reference the source
          documents used for this entry.
        </p>
        <div className="mt-4 grid gap-3">
          {groupSources(payload.sources).map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[var(--ink)]">{group.title}</span>
                <span className="text-xs text-[var(--ink-muted)]">
                  Fields: {group.items.map((item) => item.field).join(", ")}
                </span>
              </div>
              {group.items[0]?.url && (
                <a
                  className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                  href={group.items[0].url}
                >
                  Open source
                </a>
              )}
              {group.items[0]?.fetched_date && (
                <div className="mt-2 text-xs text-[var(--ink-muted)]">
                  Fetched: {formatDate(group.items[0].fetched_date)}
                </div>
              )}
            </div>
          ))}
          {payload.sources.length === 0 && (
            <p className="text-sm text-[var(--ink-muted)]">No sources listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
