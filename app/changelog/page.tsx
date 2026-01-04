export default function ChangelogPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Changelog</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Update history</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Changelog entries will appear here once change tracking is enabled for each
          candidate record.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Nhật ký thay đổi sẽ được bổ sung khi có dữ liệu theo dõi cập nhật.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Status</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Trạng thái</p>
        <p className="mt-4 text-sm text-[var(--ink-muted)]">
          Change tracking is planned but not yet populated in the dataset.
        </p>
      </section>
    </div>
  );
}
