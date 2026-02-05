import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          Landing
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--ink)]">
          Vietnam Elections
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-muted)]">
          A static, source-linked directory of official candidate information for Vietnam
          elections. Currently focused on the 2021 cycle while the 2026 dataset is prepared.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
          Dữ liệu bầu cử Việt Nam: thư mục tĩnh, có nguồn trích dẫn. Hiện tập trung
          vào kỳ 2021 trong khi dữ liệu 2026 đang được chuẩn bị.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          <Link
            href="/elections/na16-2026"
            className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-sm font-semibold text-[var(--ink-muted)]"
          >
            2026 National Assembly Cycle (coming soon)
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              Data not yet published.
            </span>
          </Link>
          <Link
            href="/elections/na15-2021"
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            2021 National Assembly Cycle
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              Previous cycle archive.
            </span>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">What you can do</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Explore the 2021 cycle archive while the 2026 dataset is being prepared.
            All entries link back to official sources.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-muted)]">
            <li>Search 2021 candidates by name, locality, or constituency.</li>
            <li>Browse 2021 constituencies and district coverage.</li>
            <li>Review official source documents and timestamps.</li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Scope and neutrality</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            This site documents official candidate lists by election cycle, locality,
            and constituency. No endorsements, rankings, or user comments.
          </p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Phạm vi: danh sách ứng cử viên theo kỳ bầu cử, địa phương và đơn vị bầu cử.
            Không có nhận xét, xếp hạng, hay bình luận.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Quick links</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Jump directly to the 2021 archive and supporting documentation.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2 lg:grid-cols-3">
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/elections/na15-2021"
          >
            2021 cycle overview
          </Link>
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/elections/na15-2021/candidates"
          >
            Candidates (2021)
          </Link>
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/elections/na15-2021/constituencies"
          >
            Constituencies (2021)
          </Link>
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/sources"
          >
            Sources
          </Link>
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/methodology"
          >
            Methodology
          </Link>
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
