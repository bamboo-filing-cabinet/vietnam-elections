import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import CycleNav from "../../CycleNav";

type District = {
  name_vi: string;
  name_folded: string;
};

type ConstituencyRecord = {
  id: string;
  locality_id: string;
  unit_number: number | null;
  seat_count: number | null;
  name_vi: string;
  name_folded: string;
  description: string | null;
  unit_context_raw: string | null;
  districts: District[];
};

type ConstituenciesPayload = {
  cycle_id: string;
  generated_at: string;
  records: ConstituencyRecord[];
};

type LocalityPayload = {
  cycle_id: string;
  generated_at: string;
  records: Array<{
    id: string;
    name_vi: string;
    name_folded: string;
    type: string;
  }>;
};

type CandidateIndexRecord = {
  entry_id: string;
  person_id: string;
  name_vi: string;
  name_folded: string;
  locality_id: string | null;
  locality_vi: string | null;
  locality_folded: string | null;
  constituency_id: string | null;
  constituency_vi: string | null;
  constituency_folded: string | null;
  unit_number: number | null;
  list_order: number | null;
};

type CandidatesIndexPayload = {
  cycle_id: string;
  generated_at: string;
  records: CandidateIndexRecord[];
};

type CandidateDetailPayload = {
  entry_id: string;
  cycle_id: string;
  person: {
    id: string;
    full_name: string;
    full_name_folded: string;
    dob: string | null;
    gender: string | null;
    nationality: string | null;
    ethnicity: string | null;
    religion: string | null;
    birthplace: string | null;
    current_residence: string | null;
  };
  entry: {
    constituency_id: string;
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
  constituency: ConstituencyRecord | null;
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

const PROFILE_COLUMNS = [
  { key: "full_name", label: "Name" },
  { key: "dob", label: "DOB" },
  { key: "gender", label: "Gender" },
  { key: "nationality", label: "Nationality" },
  { key: "ethnicity", label: "Ethnicity" },
  { key: "religion", label: "Religion" },
  { key: "birthplace", label: "Birthplace" },
  { key: "current_residence", label: "Residence" },
] as const;

const ENTRY_COLUMNS = [
  { key: "list_order", label: "List order" },
  { key: "party_member_since", label: "Party member since" },
  { key: "is_na_delegate", label: "NA delegate" },
  { key: "is_council_delegate", label: "Council delegate" },
] as const;

const ATTRIBUTE_COLUMNS = [
  { key: "education_general", label: "General education" },
  { key: "education_professional", label: "Professional training" },
  { key: "education_academic_rank", label: "Academic rank/degree" },
  { key: "education_political", label: "Political theory" },
  { key: "education_languages", label: "Foreign languages" },
  { key: "occupation_title", label: "Occupation/position" },
  { key: "workplace", label: "Workplace" },
] as const;

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function cycleBaseDir(cycle: string): string {
  return path.join(process.cwd(), "public", "data", "elections", cycle);
}

export async function generateStaticParams() {
  const cycle = "na15-2021";
  const baseDir = cycleBaseDir(cycle);
  const constituenciesPath = path.join(baseDir, "constituencies.json");
  const payload = await readJson<ConstituenciesPayload>(constituenciesPath);
  return payload.records.map((record) => ({
    cycle,
    constituencyId: record.id,
  }));
}

export default async function ConstituencyDetailPage({
  params,
}: {
  params: Promise<{ cycle: string; constituencyId: string }>;
}) {
  const { cycle, constituencyId } = await params;
  if (!SUPPORTED_CYCLES.includes(cycle)) {
    notFound();
  }

  const baseDir = cycleBaseDir(cycle);
  const constituenciesPath = path.join(baseDir, "constituencies.json");
  const candidatesIndexPath = path.join(baseDir, "candidates_index.json");
  const localitiesPath = path.join(baseDir, "localities.json");

  try {
    await Promise.all([
      fs.access(constituenciesPath),
      fs.access(candidatesIndexPath),
      fs.access(localitiesPath),
    ]);
  } catch {
    notFound();
  }

  const [constituenciesPayload, candidatesIndex, localitiesPayload] = await Promise.all([
    readJson<ConstituenciesPayload>(constituenciesPath),
    readJson<CandidatesIndexPayload>(candidatesIndexPath),
    readJson<LocalityPayload>(localitiesPath),
  ]);

  const constituency = constituenciesPayload.records.find((record) => record.id === constituencyId);
  if (!constituency) {
    notFound();
  }

  const entryRecords = candidatesIndex.records
    .filter((record) => record.constituency_id === constituencyId)
    .sort((a, b) => (a.list_order ?? 0) - (b.list_order ?? 0));

  const candidateDetails = await Promise.all(
    entryRecords.map(async (record) => {
      const detailPath = path.join(baseDir, "candidates_detail", `${record.entry_id}.json`);
      return readJson<CandidateDetailPayload>(detailPath);
    })
  );

  const localityName =
    localitiesPayload.records.find((record) => record.id === constituency.locality_id)
      ?.name_vi ?? constituency.locality_id;

  return (
    <div className="grid gap-6 stagger">
      <CycleNav cycle={cycle} />
      <Link
        href={`/elections/${cycle}/constituencies`}
        className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
      >
        Back to constituencies
      </Link>

      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          {cycle}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
          {constituency.name_vi}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          {localityName} · Seats: {constituency.seat_count ?? "—"} · Unit{" "}
          {constituency.unit_number ?? "—"}
        </p>
        {constituency.description && (
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{constituency.description}</p>
        )}
        {constituency.districts.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {constituency.districts.map((district) => (
              <span
                key={district.name_folded}
                className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-[var(--ink-muted)]"
              >
                {district.name_vi}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Candidates · Ứng cử viên
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Compare candidate profiles in this constituency. Default order follows the
          official list.
        </p>
        {candidateDetails.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            No candidates listed for this constituency yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[1200px] border-collapse text-left text-sm text-[var(--ink-muted)]">
              <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                <tr>
                  {ENTRY_COLUMNS.map((column) => (
                    <th key={column.key} className="sticky top-0 border-b border-[var(--border)] px-3 py-2">
                      {column.label}
                    </th>
                  ))}
                  {PROFILE_COLUMNS.map((column) => (
                    <th key={column.key} className="sticky top-0 border-b border-[var(--border)] px-3 py-2">
                      {column.label}
                    </th>
                  ))}
                  {ATTRIBUTE_COLUMNS.map((column) => (
                    <th key={column.key} className="sticky top-0 border-b border-[var(--border)] px-3 py-2">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidateDetails.map((candidate, index) => {
                  const attributes = new Map(
                    candidate.attributes.map((attr) => [attr.key, attr.value])
                  );
                  return (
                    <tr
                      key={candidate.entry_id}
                      className={index % 2 === 0 ? "bg-transparent" : "bg-[var(--surface-muted)]"}
                    >
                      {ENTRY_COLUMNS.map((column) => {
                        const value = candidate.entry[column.key];
                        return (
                          <td key={column.key} className="border-b border-[var(--border)] px-3 py-2">
                            {value ?? "—"}
                          </td>
                        );
                      })}
                      {PROFILE_COLUMNS.map((column) => {
                        const value = candidate.person[column.key];
                        if (column.key === "full_name") {
                          return (
                            <td key={column.key} className="border-b border-[var(--border)] px-3 py-2 text-[var(--ink)]">
                              <Link
                                href={`/elections/${cycle}/candidates/${candidate.entry_id}`}
                                className="font-semibold text-[var(--ink)] hover:text-[var(--flag-red)]"
                              >
                                {value ?? "—"}
                              </Link>
                            </td>
                          );
                        }
                        return (
                          <td key={column.key} className="border-b border-[var(--border)] px-3 py-2">
                            {value ?? "—"}
                          </td>
                        );
                      })}
                      {ATTRIBUTE_COLUMNS.map((column) => (
                        <td key={column.key} className="border-b border-[var(--border)] px-3 py-2">
                          {attributes.get(column.key) ?? "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
