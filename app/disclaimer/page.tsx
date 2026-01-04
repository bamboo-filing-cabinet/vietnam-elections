export default function DisclaimerPage() {
  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Disclaimer</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Neutral, sourced directory</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Vietnam Elections is an informational directory based on official sources. It
          does not provide endorsements, rankings, or commentary.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Dữ liệu mang tính thông tin, không có nhận xét hay xếp hạng.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Limitations</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Gioi han su dung
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>Data reflects the state of the sources at the time of collection.</li>
          <li>Errors may exist in source documents; corrections are welcome.</li>
          <li>This site does not solicit or publish user submissions.</li>
        </ul>
      </section>
    </div>
  );
}
