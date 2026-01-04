import fs from "node:fs/promises";
import path from "node:path";

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

async function readDocuments(): Promise<DocumentsPayload | null> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    "na15-2021",
    "documents.json"
  );
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as DocumentsPayload;
  } catch {
    return null;
  }
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

export default async function SourcesPage() {
  const documents = await readDocuments();
  const records = documents?.records ?? [];

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Sources</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Official documents</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Every factual field is tied to a published source. This registry lists the
          baseline documents used for the 2021 cycle.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Tất cả thông tin đều có nguồn. Danh sách bên dưới là tài liệu cơ bản.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">National Assembly 15 (2021)</h2>
        <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          {records.map((doc) => (
            <div key={doc.id} className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <p className="font-semibold text-[var(--ink)]">{doc.title}</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                Fetched: {formatDate(doc.fetched_date)}
              </p>
              {doc.url && (
                <a
                  className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                  href={doc.url}
                >
                  Open source
                </a>
              )}
            </div>
          ))}
          {records.length === 0 && (
            <p className="text-sm text-[var(--ink-muted)]">No documents published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
