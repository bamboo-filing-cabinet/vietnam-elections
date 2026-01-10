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

type ResultsAnnotation = {
  id: string;
  status: string;
  reason: string | null;
  effective_date: string | null;
  source: ResultsSource | null;
  notes: string | null;
};

type ResultsRecord = {
  id: string;
  candidate_entry_id: string | null;
  candidate_name_vi: string;
  constituency_id: string | null;
  unit_number: number | null;
  unit_description_vi: string | null;
  order_in_unit: number | null;
  status: string | null;
  votes: number | null;
  votes_raw: string | null;
  percent: number | null;
  percent_raw: string | null;
  annotations: ResultsAnnotation[];
};

type ResultsPayload = {
  cycle_id: string;
  generated_at: string;
  source: ResultsSource | null;
  summary: Record<string, unknown> | null;
  records: ResultsRecord[];
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

const PROFILE_LABELS: Record<string, { en: string; vi: string }> = {
  dob: { en: "Date of birth", vi: "Ngày tháng năm sinh" },
  gender: { en: "Gender", vi: "Giới tính" },
  nationality: { en: "Nationality", vi: "Quốc tịch" },
  ethnicity: { en: "Ethnicity", vi: "Dân tộc" },
  religion: { en: "Religion", vi: "Tôn giáo" },
  birthplace: { en: "Birthplace", vi: "Quê quán" },
  current_residence: { en: "Residence", vi: "Nơi ở hiện nay" },
};

const PROFILE_FIELD_KEYS = [
  "dob",
  "gender",
  "nationality",
  "ethnicity",
  "religion",
  "birthplace",
  "current_residence",
] as const;

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

function formatDocType(value: string | null): string {
  if (!value) {
    return "Unknown";
  }
  return value.toUpperCase();
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

function formatAnnotationDetails(annotation: ResultsAnnotation): string {
  const parts = [annotation.reason, annotation.effective_date]
    .filter(Boolean)
    .map((value) => String(value));
  return parts.length > 0 ? parts.join(" · ") : "Source cited";
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
  const resultsPath = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    cycle,
    "results.json"
  );

  try {
    await fs.access(detailPath);
  } catch {
    notFound();
  }

  const payload = await readJson<CandidateDetailPayload>(detailPath);
  let resultsPayload: ResultsPayload | null = null;
  try {
    await fs.access(resultsPath);
    resultsPayload = await readJson<ResultsPayload>(resultsPath);
  } catch {
    resultsPayload = null;
  }
  const resultsRecord =
    resultsPayload?.records.find((record) => record.candidate_entry_id === entryId) ?? null;
  const derivedStatus =
    resultsRecord?.status ??
    deriveResultStatus(resultsRecord?.order_in_unit ?? null, payload.constituency?.seat_count);
  const politicalBackground = [
    {
      label: { en: "Party member since", vi: "Ngày vào Đảng" },
      value: payload.entry.party_member_since,
    },
    {
      label: { en: "National Assembly delegate", vi: "Là đại biểu QH" },
      value: payload.entry.is_na_delegate,
    },
    {
      label: { en: "People's Council delegate", vi: "Là đại biểu HĐND" },
      value: payload.entry.is_council_delegate,
    },
  ];
  const hasPoliticalBackground = politicalBackground.some((item) => item.value);

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
          {payload.constituency?.id ? (
            <Link
              href={`/elections/${cycle}/constituencies/${payload.constituency.id}`}
              className="font-semibold text-[var(--ink)] hover:text-[var(--flag-red)]"
            >
              {payload.constituency?.name_vi ?? "Unknown constituency"}
            </Link>
          ) : (
            payload.constituency?.name_vi ?? "Unknown constituency"
          )}
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Results · Kết quả</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Vote totals and rankings for this candidate in the official results.
        </p>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Số phiếu và thứ hạng theo công bố chính thức.
        </p>
        {!resultsRecord ? (
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Results are not yet available for this candidate.
          </p>
        ) : (
          <>
            <div className="mt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                Status · Trạng thái
              </span>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
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
                {resultsRecord.annotations.map((annotation) => (
                  <span
                    key={annotation.id}
                    className="rounded-full border-2 border-[var(--flag-red)]/40 bg-[var(--surface-muted)] px-2 py-0.5 text-[var(--flag-red-deep)]"
                    title={formatAnnotationDetails(annotation)}
                  >
                    {formatStatus(annotation.status)}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-3">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Rank · Thứ hạng
                </span>
                <p className="mt-1">{formatNumber(resultsRecord.order_in_unit)}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Votes · Phiếu bầu
                </span>
                <p className="mt-1">{formatNumber(resultsRecord.votes)}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Percent · Tỷ lệ
                </span>
                <p className="mt-1">
                  {formatPercent(resultsRecord.percent, resultsRecord.percent_raw)}
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Profile · Hồ sơ ứng cử viên
        </h2>
        <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2">
          {PROFILE_FIELD_KEYS.map((key) => {
            const label = PROFILE_LABELS[key];
            const value = payload.person[key];
            return (
              <div key={key}>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  {label.en} · {label.vi}
                </span>
                <p className="mt-1">{value ?? "—"}</p>
              </div>
            );
          })}
        </div>
      </section>

      {hasPoliticalBackground && (
        <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Political background · Thông tin chính trị
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2">
            {politicalBackground.map((item) => (
              <div key={item.label.en}>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  {item.label.en} · {item.label.vi}
                </span>
                <p className="mt-1">{item.value ?? "—"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {payload.attributes.length > 0 && (
        <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Attributes · Thông tin bổ sung
          </h2>
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
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Sources · Nguồn tài liệu
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Each field is tied to an official document. Links below reference the source
          documents used for this entry.
        </p>
        <div className="mt-4 grid gap-4">
          {(resultsPayload?.source || resultsRecord?.annotations.length) && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                Results sources · Nguồn kết quả
              </p>
              <div className="mt-3 grid gap-3">
                {resultsPayload?.source && (
                  <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-[var(--ink)]">
                        {resultsPayload.source.title}
                      </span>
                      <span className="text-xs text-[var(--ink-muted)]">
                        Items · Mục: results
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
                  </div>
                )}
                {resultsRecord?.annotations.map((annotation) =>
                  annotation.source ? (
                    <div
                      key={`${annotation.id}-source`}
                      className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[var(--ink)]">
                          {annotation.source.title}
                        </span>
                        <span className="text-xs text-[var(--ink-muted)]">
                          Items · Mục: results_annotation ({formatStatus(annotation.status)})
                        </span>
                        <div className="text-xs text-[var(--ink-muted)]">
                          Type · Loại: {formatDocType(annotation.source.doc_type)} · Published ·
                          Xuất bản: {formatDate(annotation.source.published_date)}
                        </div>
                      </div>
                      {annotation.source.url && (
                        <a
                          className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                          href={annotation.source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open source
                        </a>
                      )}
                      {annotation.source.fetched_date && (
                        <div className="mt-2 text-xs text-[var(--ink-muted)]">
                          Fetched · Thu thập: {formatDate(annotation.source.fetched_date)}
                        </div>
                      )}
                      {annotation.reason && (
                        <div className="mt-2 text-xs text-[var(--ink-muted)]">
                          Notes · Ghi chú: {annotation.reason}
                        </div>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
              Candidate sources · Nguồn ứng cử
            </p>
            <div className="mt-3 grid gap-3">
              {groupSources(payload.sources).map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[var(--ink)]">{group.title}</span>
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
              {payload.sources.length === 0 && (
                <p className="text-sm text-[var(--ink-muted)]">No sources listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {payload.changelog.length > 0 && (
        <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Changelog · Nhật ký thay đổi
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
            {payload.changelog.map((entry, index) => (
              <div key={`${entry.changed_at}-${index}`} className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  {entry.change_type}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                  {formatDate(entry.changed_at)}
                </p>
                {entry.summary && (
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">{entry.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--ink-muted)] shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Metadata · Dữ liệu kỹ thuật
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
              Candidate list order · STT danh sách
            </span>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              {payload.entry.list_order ?? "—"}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Official numbering in the candidates list for that constituency (STT).
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
              Last updated · Cập nhật lần cuối
            </span>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              {latestFetchedDate(payload.sources)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
