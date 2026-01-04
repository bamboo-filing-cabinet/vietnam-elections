export default function TermsPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Terms</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Terms of use</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Use this site as a reference directory. Verify critical details with the
          original sources.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Su dung nhu mot thu muc tham khao. Vui long kiem tra lai voi nguon goc.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Usage</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Dieu khoan</p>
        <ul className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>No endorsements or political advocacy are provided here.</li>
          <li>All data is provided as-is from cited sources.</li>
          <li>Attribution to official sources is required when reusing data.</li>
        </ul>
      </section>
    </div>
  );
}
