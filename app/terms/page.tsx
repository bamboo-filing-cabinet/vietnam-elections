export default function TermsPage() {
  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Terms</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Terms of use</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Use this site as a reference directory. Verify critical details with the
          original sources.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Sử dụng như một thư mục tham khảo. Vui lòng đối chiếu với nguồn gốc.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Usage</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Điều khoản</p>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>No endorsements or political advocacy are provided here.</li>
          <li>All data is provided as-is from cited sources.</li>
          <li>Attribution to official sources is required when reusing data.</li>
        </ul>
      </section>
    </div>
  );
}
