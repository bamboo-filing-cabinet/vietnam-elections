import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CycleNav from "./CycleNav";

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

type DocumentsPayload = {
  cycle_id: string;
  generated_at: string;
  records: Array<{
    id: string;
    title: string;
    url: string | null;
    file_path: string | null;
    doc_type: string | null;
    published_date: string | null;
    fetched_date: string | null;
    notes: string | null;
  }>;
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
  records: Array<{
    id: string;
    constituency_id: string | null;
  }>;
};

const SUPPORTED_CYCLES = ["na15-2021", "na16-2026"];

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
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

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value.toFixed(2)}%`;
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

  let timeline: TimelinePayload | null = null;
  let candidates: CandidatesIndexPayload | null = null;
  let documents: DocumentsPayload | null = null;
  let results: ResultsPayload | null = null;
  try {
    timeline = await readJson<TimelinePayload>(
      path.join(baseDir, "timeline.json")
    );
    candidates = await readJson<CandidatesIndexPayload>(
      path.join(baseDir, "candidates_index.json")
    );
    documents = await readJson<DocumentsPayload>(
      path.join(baseDir, "documents.json")
    );
  } catch {
    timeline = null;
    candidates = null;
    documents = null;
  }
  try {
    results = await readJson<ResultsPayload>(path.join(baseDir, "results.json"));
  } catch {
    results = null;
  }
  const hasDocuments = (documents?.records.length ?? 0) > 0;
  const hasTimelineDetails =
    !!timeline &&
    (timeline.cycle.start_date || timeline.cycle.end_date || timeline.cycle.notes);
  const hasResultsSummary = !!results?.summary;
  const hasResults = (results?.records.length ?? 0) > 0;

  return (
    <div className="grid gap-8 stagger">
      <CycleNav cycle={cycle} />
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        {timeline && candidates ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
              {timeline.cycle.year}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">
              {timeline.cycle.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
              Official candidate directory and constituency references for this election cycle.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
              Thư mục ứng cử viên và tài liệu đơn vị bầu cử cho kỳ bầu cử này.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Candidates</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                  {candidates.records.length.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Generated</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                  {new Date(candidates.generated_at).toLocaleDateString("en-US")}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Cycle ID</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                  {timeline.cycle.id}
                </p>
              </div>
            </div>
            {hasTimelineDetails && (
              <div className="mt-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Timeline</p>
                <div className="mt-3 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-3">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Start date
                    </span>
                    <p className="mt-1">{formatDate(timeline.cycle.start_date)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      End date
                    </span>
                    <p className="mt-1">{formatDate(timeline.cycle.end_date)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Notes
                    </span>
                    <p className="mt-1">{timeline.cycle.notes ?? "—"}</p>
                  </div>
                </div>
              </div>
            )}
            {hasResultsSummary && results?.summary && (
              <div className="mt-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                  Results overview · Tổng quan kết quả
                </p>
                <div className="mt-3 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-3">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Seats · Số ghế
                    </span>
                    <p className="mt-1">{formatNumber(results.summary.total_seats)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Candidates · Ứng cử viên
                    </span>
                    <p className="mt-1">{formatNumber(results.summary.total_candidates)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Turnout · Tỷ lệ
                    </span>
                    <p className="mt-1">{formatPercent(results.summary.turnout_percent)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Votes cast · Phiếu bầu
                    </span>
                    <p className="mt-1">{formatNumber(results.summary.total_votes_cast)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Valid · Hợp lệ
                    </span>
                    <p className="mt-1">{formatNumber(results.summary.valid_votes)}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Invalid · Không hợp lệ
                    </span>
                    <p className="mt-1">{formatNumber(results.summary.invalid_votes)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
                  <span className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1">
                    Confirmed · Xác nhận: {formatNumber(results.summary.confirmed_winners)}
                  </span>
                  <span className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1">
                    Unconfirmed · Chưa xác nhận: {formatNumber(results.summary.unconfirmed_winners)}
                  </span>
                  <span className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1">
                    Records · Bản ghi: {formatNumber(results.records.length)}
                  </span>
                </div>
                {results.source?.title && (
                  <div className="mt-4 text-xs text-[var(--ink-muted)]">
                    <span className="uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                      Results source · Nguồn kết quả
                    </span>
                    <div className="mt-2">
                      {results.source.url ? (
                        <a
                          href={results.source.url}
                          className="text-xs text-[var(--ink-muted)] hover:text-[var(--flag-red)]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {results.source.title}
                        </a>
                      ) : (
                        <span className="text-xs">{results.source.title}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Coming soon</p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">
              {cycle === "na16-2026"
                ? "16th National Assembly (2026)"
                : "Election cycle"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
              Official datasets for this cycle are not yet available. This page will
              publish the directory when sources are added.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
              Dữ liệu chưa sẵn sàng. Trang này sẽ cập nhật khi có tài liệu.
            </p>
          </>
        )}
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Explore</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {candidates ? (
            <Link
              href={`/elections/${cycle}/candidates`}
              className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
            >
              <p className="text-sm font-semibold text-[var(--ink)]">Candidate directory</p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                Search and filter official entries.
              </p>
            </Link>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-5 text-xs text-[var(--ink-muted)]">
              Candidate directory will appear when data is published.
            </div>
          )}
          {candidates ? (
            <Link
              href={`/elections/${cycle}/constituencies`}
              className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
            >
              <p className="text-sm font-semibold text-[var(--ink)]">Constituencies</p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                View units, seats, and district coverage.
              </p>
            </Link>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-5 text-xs text-[var(--ink-muted)]">
              Constituencies will appear when data is published.
            </div>
          )}
          {hasResults ? (
            <Link
              href={`/elections/${cycle}/constituencies`}
              className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
            >
              <p className="text-sm font-semibold text-[var(--ink)]">
                Results by constituency
              </p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                Vote totals for each constituency.
              </p>
            </Link>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-5 text-xs text-[var(--ink-muted)]">
              Results will appear when data is published.
            </div>
          )}
          <Link
            href={`/elections/${cycle}/sources`}
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            <p className="text-sm font-semibold text-[var(--ink)]">Sources</p>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">
              {hasDocuments
                ? "Browse official documents for this cycle."
                : "Sources will appear when documents are published."}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
