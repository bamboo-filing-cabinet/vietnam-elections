import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import CycleNav from "../../CycleNav";

type District = {
  name_vi: string;
  name_folded: string;
  sources?: SourceRecord[];
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
  sources?: SourceRecord[];
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

type SourceRecord = {
  field: string;
  document_id: string;
  title: string;
  url: string | null;
  doc_type: string | null;
  published_date: string | null;
  fetched_date: string | null;
  notes: string | null;
};

type ResultsSummary = {
  total_seats: number | null;
  total_candidates: number | null;
  total_voters: number | null;
  total_votes_cast: number | null;
  turnout_percent: number | null;
  valid_votes: number | null;
  invalid_votes: number | null;
  confirmed_winners: number | null;
  unconfirmed_winners: number | null;
};

type ResultsRecord = {
  id: string;
  candidate_entry_id: string | null;
  person_id: string | null;
  candidate_name_vi: string;
  candidate_name_folded: string;
  locality_id: string | null;
  constituency_id: string | null;
  unit_number: number | null;
  unit_description_vi: string | null;
  order_in_unit: number | null;
  status: string | null;
  votes: number | null;
  votes_raw: string | null;
  percent: number | null;
  percent_raw: string | null;
  notes: string | null;
  sources: SourceRecord[];
  annotations: Array<{
    id: string;
    status: string;
    reason: string | null;
    effective_date: string | null;
    source: ResultsSource | null;
    notes: string | null;
  }>;
};

type ResultsSource = {
  id: string;
  title: string;
  url: string | null;
  file_path: string | null;
  doc_type: string | null;
  published_date: string | null;
  fetched_date: string | null;
  notes: string | null;
};

type ResultsPayload = {
  cycle_id: string;
  generated_at: string;
  source: ResultsSource | null;
  summary: ResultsSummary | null;
  records: ResultsRecord[];
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

const COL_CLASSES = {
  tight: "min-w-[90px] whitespace-nowrap",
  name: "min-w-[180px] whitespace-nowrap",
  wide: "min-w-[180px] max-w-[260px] truncate whitespace-nowrap",
};

function formatText(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

function formatCommaList(value: string): string {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function groupSources(sources: SourceRecord[]): Array<{ title: string; items: SourceRecord[] }> {
  const map = new Map<string, SourceRecord[]>();
  sources.forEach((source) => {
    const key = source.title || "Untitled document";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(source);
  });
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
}

function formatDocType(value: string | null): string {
  if (!value) {
    return "Unknown";
  }
  return value.toUpperCase();
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

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString("en-US");
}

function formatPercent(value: number | null, fallback: string | null): string {
  if (value === null || value === undefined) {
    return fallback ? `${fallback}%` : "—";
  }
  return `${value.toFixed(2)}%`;
}

function formatStatus(value: string): string {
  return value
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function statusBadgeStyle(value: string | null): React.CSSProperties | undefined {
  if (value === "won") {
    return {
      borderColor: "var(--status-won, #2f8f6b)",
      color: "var(--status-won, #2f8f6b)",
    };
  }
  if (value === "lost") {
    return {
      borderColor: "var(--status-lost, #b0742d)",
      color: "var(--status-lost, #b0742d)",
    };
  }
  return undefined;
}

function deriveResultStatus(
  orderInUnit: number | null,
  seatCount: number | null | undefined
): string | null {
  if (orderInUnit === null || orderInUnit === undefined) {
    return null;
  }
  if (seatCount === null || seatCount === undefined) {
    return null;
  }
  return orderInUnit <= seatCount ? "win" : "lose";
}

function formatAnnotationDetails(annotation: ResultsRecord["annotations"][number]): string {
  const parts = [annotation.reason, annotation.effective_date]
    .filter(Boolean)
    .map((value) => String(value));
  return parts.length > 0 ? parts.join(" · ") : "Source cited";
}

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
  const resultsPath = path.join(baseDir, "results.json");

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
  let resultsPayload: ResultsPayload | null = null;
  try {
    await fs.access(resultsPath);
    resultsPayload = await readJson<ResultsPayload>(resultsPath);
  } catch {
    resultsPayload = null;
  }

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
  const candidateDetailMap = new Map(
    candidateDetails.map((candidate) => [candidate.entry_id, candidate])
  );
  const resultsRecords = resultsPayload
    ? resultsPayload.records
        .filter((record) => record.constituency_id === constituencyId)
        .sort((a, b) => (a.order_in_unit ?? 0) - (b.order_in_unit ?? 0))
    : [];

  const localityName =
    localitiesPayload.records.find((record) => record.id === constituency.locality_id)
      ?.name_vi ?? constituency.locality_id;
  const descriptionText = constituency.description
    ? formatCommaList(constituency.description)
    : null;
  const unitContextText = constituency.unit_context_raw
    ? formatCommaList(constituency.unit_context_raw)
    : null;

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
        {descriptionText && (
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Coverage: {descriptionText}
          </p>
        )}
        {!descriptionText && unitContextText && (
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Coverage: {unitContextText}
          </p>
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

      <section className="min-w-0 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Results · Kết quả</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Vote totals are listed in descending order for this constituency.
        </p>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Số phiếu được xếp theo thứ tự giảm dần trong đơn vị này.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
          <span className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1">
            Candidates: {formatNumber(resultsRecords.length)}
          </span>
          <span className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1">
            Seats: {formatNumber(constituency.seat_count ?? null)}
          </span>
        </div>
        {resultsRecords.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Results are not yet available for this constituency.
          </p>
        ) : (
          <div className="mt-4 min-w-0">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              <span>Scroll</span>
              <span aria-hidden="true">→</span>
            </div>
            <div
              className="mt-2 w-full min-w-0 touch-pan-x overflow-x-auto overscroll-x-contain"
              style={{ scrollbarGutter: "stable both-edges" }}
              role="region"
              aria-label="Scrollable results table"
            >
              <table className="min-w-full w-max border-collapse text-left text-sm text-[var(--ink-muted)] tabular-nums">
                <caption className="sr-only">
                  Results table for {constituency.name_vi}
                </caption>
                <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  <tr>
                    <th className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.tight}`}>
                      Rank
                    </th>
                    <th className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.name}`}>
                      Candidate
                    </th>
                    <th className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}>
                      Votes
                    </th>
                    <th className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}>
                      Percent
                    </th>
                    <th className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultsRecords.map((record, index) => {
                    const candidate =
                      record.candidate_entry_id &&
                      candidateDetailMap.get(record.candidate_entry_id);
                    const name = candidate
                      ? candidate.person.full_name
                      : record.candidate_name_vi;
                    const derivedStatus =
                      record.status ??
                      deriveResultStatus(record.order_in_unit, constituency.seat_count ?? null);
                    return (
                      <tr
                        key={record.id}
                        className={index % 2 === 0 ? "bg-transparent" : "bg-[var(--surface-muted)]"}
                      >
                        <td
                          className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.tight}`}
                        >
                          {record.order_in_unit ?? "—"}
                        </td>
                        <td
                          className={`border-b border-[var(--border)] px-3 py-2 align-top text-[var(--ink)] ${COL_CLASSES.name}`}
                        >
                          <div className="flex flex-col gap-1">
                            {candidate ? (
                              <Link
                                href={`/elections/${cycle}/candidates/${candidate.entry_id}`}
                                className="font-semibold text-[var(--ink)] hover:text-[var(--flag-red)]"
                              >
                                {formatText(name)}
                              </Link>
                            ) : (
                              <span className="font-semibold text-[var(--ink)]">
                                {formatText(name)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                        >
                          {formatNumber(record.votes)}
                        </td>
                        <td
                          className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                        >
                          {formatPercent(record.percent, record.percent_raw)}
                        </td>
                        <td
                          className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                        >
                          <div className="flex flex-wrap gap-2 text-xs">
                            {derivedStatus ? (() => {
                              const style = statusBadgeStyle(derivedStatus);
                              const baseClass =
                                "rounded-full border-2 bg-[var(--surface-muted)] px-2 py-0.5";
                              const fallbackClass = "border-[var(--border)] text-[var(--ink)]";
                              return (
                                <span
                                  className={`${baseClass} ${style ? "" : fallbackClass}`}
                                  style={style}
                                >
                                  {formatStatus(derivedStatus)}
                                </span>
                              );
                            })() : (
                              <span className="text-[var(--ink-muted)]">—</span>
                            )}
                            {record.annotations.map((annotation) => (
                              <span
                                key={annotation.id}
                                className="rounded-full border-2 border-[var(--flag-red)]/40 bg-[var(--surface-muted)] px-2 py-0.5 text-[var(--flag-red-deep)]"
                                title={formatAnnotationDetails(annotation)}
                              >
                                {formatStatus(annotation.status)}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="min-w-0 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
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
          <div className="mt-4 min-w-0">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              <span>Scroll</span>
              <span aria-hidden="true">→</span>
            </div>
            <div
              className="mt-2 w-full min-w-0 touch-pan-x overflow-x-auto overscroll-x-contain"
              style={{ scrollbarGutter: "stable both-edges" }}
              role="region"
              aria-label="Scrollable candidate comparison table"
            >
              <table className="min-w-full w-max border-collapse text-left text-sm text-[var(--ink-muted)] tabular-nums">
              <caption className="sr-only">
                Candidate comparison table for {constituency.name_vi}
              </caption>
              <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                <tr>
                  <th
                    key={ENTRY_COLUMNS[0].key}
                    scope="col"
                    className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.tight}`}
                  >
                    {ENTRY_COLUMNS[0].label}
                  </th>
                  <th
                    key={PROFILE_COLUMNS[0].key}
                    scope="col"
                    className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.name}`}
                  >
                    {PROFILE_COLUMNS[0].label}
                  </th>
                  {ENTRY_COLUMNS.slice(1).map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {PROFILE_COLUMNS.slice(1).map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {ATTRIBUTE_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`sticky top-0 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 ${COL_CLASSES.wide}`}
                    >
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
                      <td
                        className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.tight}`}
                      >
                        {candidate.entry.list_order ?? "—"}
                      </td>
                      <td
                        className={`border-b border-[var(--border)] px-3 py-2 align-top text-[var(--ink)] ${COL_CLASSES.name}`}
                      >
                        <Link
                          href={`/elections/${cycle}/candidates/${candidate.entry_id}`}
                          className="font-semibold text-[var(--ink)] hover:text-[var(--flag-red)]"
                        >
                          {formatText(candidate.person.full_name)}
                        </Link>
                      </td>
                      {ENTRY_COLUMNS.slice(1).map((column) => {
                        const value = candidate.entry[column.key];
                        const display =
                          typeof value === "string" ? formatText(value) : value ?? "—";
                        return (
                          <td
                            key={column.key}
                            className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                            title={typeof display === "string" ? display : String(display)}
                          >
                            {display}
                          </td>
                        );
                      })}
                      {PROFILE_COLUMNS.slice(1).map((column) => {
                        const display = formatText(candidate.person[column.key]);
                        return (
                          <td
                            key={column.key}
                            className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                            title={display}
                          >
                            {display}
                          </td>
                        );
                      })}
                      {ATTRIBUTE_COLUMNS.map((column) => {
                        const display = formatText(attributes.get(column.key));
                        return (
                          <td
                            key={column.key}
                            className={`border-b border-[var(--border)] px-3 py-2 align-top ${COL_CLASSES.wide}`}
                            title={display}
                          >
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </section>

      {(constituency.sources && constituency.sources.length > 0) ||
      resultsPayload?.source?.title ? (
        <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Sources · Nguồn tài liệu
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Official documents used for constituency boundaries and results.
          </p>
          <div className="mt-4 grid gap-4">
            {constituency.sources && constituency.sources.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Constituency sources · Nguồn đơn vị
                </p>
                <div className="mt-3 grid gap-3">
                  {groupSources(constituency.sources).map((group) => (
                    <div
                      key={group.title}
                      className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[var(--ink)]">
                          {group.title}
                        </span>
                        <span className="text-xs text-[var(--ink-muted)]">
                          Items · Mục: {group.items.map((item) => item.field).join(", ")}
                        </span>
                        <div className="text-xs text-[var(--ink-muted)]">
                          Type · Loại: {formatDocType(group.items[0]?.doc_type)} · Published ·
                          Xuất bản: {formatDate(group.items[0]?.published_date)}
                        </div>
                      </div>
                      {group.items[0]?.url && (
                        <a
                          className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                          href={group.items[0].url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open source
                        </a>
                      )}
                      {group.items[0]?.fetched_date && (
                        <div className="mt-2 text-xs text-[var(--ink-muted)]">
                          Fetched · Thu thập: {formatDate(group.items[0].fetched_date)}
                        </div>
                      )}
                      {group.items[0]?.notes && (
                        <div className="mt-2 text-xs text-[var(--ink-muted)]">
                          Notes · Ghi chú: {group.items[0].notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {resultsPayload?.source?.title && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Results source · Nguồn kết quả
                </p>
                <div className="mt-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[var(--ink)]">
                      {resultsPayload.source.title}
                    </span>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Type · Loại: {formatDocType(resultsPayload.source.doc_type)} · Published ·
                      Xuất bản: {formatDate(resultsPayload.source.published_date)}
                    </div>
                  </div>
                  {resultsPayload.source.url && (
                    <a
                      className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                      href={resultsPayload.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open source
                    </a>
                  )}
                  {resultsPayload.source.fetched_date && (
                    <div className="mt-2 text-xs text-[var(--ink-muted)]">
                      Fetched · Thu thập: {formatDate(resultsPayload.source.fetched_date)}
                    </div>
                  )}
                  {resultsPayload.source.notes && (
                    <div className="mt-2 text-xs text-[var(--ink-muted)]">
                      Notes · Ghi chú: {resultsPayload.source.notes}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
