export default function PrivacyPage() {
  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Privacy</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Privacy policy</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          This site does not collect personal accounts or accept public submissions.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Trang này không thu thập tài khoản cá nhân hoặc nhận nội dung từ công chúng.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Data collection</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Dữ liệu</p>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
          <li>No user accounts or profiles are created.</li>
          <li>No comments or public submissions are collected.</li>
          <li>Basic server logs may exist for hosting operations.</li>
        </ul>
      </section>
    </div>
  );
}
