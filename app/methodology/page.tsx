export default function MethodologyPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Methodology</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">How this directory is built</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Vietnam Elections is a static directory derived from official sources. It is
          not a news product and does not add commentary or rankings.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Dữ liệu được tổng hợp từ tài liệu chính thức, không bình luận hay xếp hạng.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Pipeline</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Quy trình dữ liệu
        </p>
        <ol className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>1) Collect official PDFs/DOCX files and store raw copies.</li>
          <li>2) Normalize tables into a staging SQLite database.</li>
          <li>3) Export JSON for the static site (search index + detail pages).</li>
          <li>4) Publish with timestamps and source links.</li>
        </ol>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Integrity checks</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Kiểm tra chất lượng
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>Foreign key checks on the staging database.</li>
          <li>Duplicate detection by name + locality.</li>
          <li>Required field checks for candidate entries.</li>
          <li>Source coverage checks for each entry.</li>
        </ul>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Field notes</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Ghi chú trường dữ liệu
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>General education uses the Vietnamese grade system (12/12 = completed high school; 10/10 = older system).</li>
        </ul>
      </section>
    </div>
  );
}
