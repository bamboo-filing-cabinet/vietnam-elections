import Link from "next/link";

export default function SourcesPage() {
  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Sources</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Cross-election sources</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Every factual field is tied to a published source. This page lists sources
          that apply to all elections.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Tất cả thông tin đều có nguồn. Trang này dành cho tài liệu dùng chung.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Election-specific sources</h2>
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          Sources for each election cycle live on the election pages.
        </p>
        <Link
          className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
          href="/elections"
        >
          Browse elections
        </Link>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-6 text-sm text-[var(--ink-muted)]">
        Global sources will appear here as they are added.
      </section>
    </div>
  );
}
