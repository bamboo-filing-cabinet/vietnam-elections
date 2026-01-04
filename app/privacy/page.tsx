export default function PrivacyPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Privacy</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Privacy policy</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          This site does not collect personal accounts or accept public submissions.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Trang nay khong thu thap tai khoan ca nhan hoac nhan noi dung tu cong chung.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Data collection</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Du lieu</p>
        <ul className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>No user accounts or profiles are created.</li>
          <li>No comments or public submissions are collected.</li>
          <li>Basic server logs may exist for hosting operations.</li>
        </ul>
      </section>
    </div>
  );
}
