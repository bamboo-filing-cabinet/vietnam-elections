import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          Landing
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--ink)]">
          Vietnam Elections
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-muted)]">
          A static, source-linked directory of official candidate information for Vietnam
          elections. Built for transparency and historical reference.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
          Dữ liệu bầu cử Việt Nam: thư mục tĩnh, có nguồn trích dẫn, tổng hợp thông
          tin ứng cử viên từ tài liệu chính thức.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/elections/na15-2021/candidates"
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            Search candidates (2021)
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              Find official entries by name or locality.
            </span>
          </Link>
          <Link
            href="/elections/na15-2021/constituencies"
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            Browse constituencies (2021)
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              See districts and seat counts.
            </span>
          </Link>
          <Link
            href="/sources"
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-1 hover:border-[var(--flag-red)] hover:shadow-[0_16px_32px_-24px_rgba(218,37,29,0.6)]"
          >
            Sources & methodology
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              How the data is collected.
            </span>
          </Link>
          <Link
            href="/elections/na16-2026"
            className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-sm font-semibold text-[var(--ink-muted)]"
          >
            2026 cycle (coming soon)
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">
              Dataset not yet published.
            </span>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--ink)]">What you can do</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Explore official candidate entries, see constituency boundaries, and verify
            information against published sources.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-muted)]">
            <li>Search candidates by name, locality, or constituency.</li>
            <li>Browse constituencies and district coverage.</li>
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
          Jump directly to key sections of the directory.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2 lg:grid-cols-3">
          <Link
            className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--flag-red)] hover:text-[var(--ink)]"
            href="/elections"
          >
            Elections index
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
        </div>
      </section>
    </div>
  );
}
