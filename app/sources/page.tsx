export default function SourcesPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Sources</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Official documents</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Every factual field is tied to a published source. This registry lists the
          baseline documents used for the 2021 cycle.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Tat ca thong tin deu co nguon. Danh sach ben duoi la tai lieu co ban.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">National Assembly 15 (2021)</h2>
        <div className="mt-4 grid gap-3 text-sm text-zinc-600">
          <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
            <p className="font-semibold text-zinc-900">Candidate list (PDF)</p>
            <p className="mt-1 text-xs text-zinc-500">
              Fetched: 2026-01-02
            </p>
            <a
              className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
              href="https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf"
            >
              Open source
            </a>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
            <p className="font-semibold text-zinc-900">Congressional units (PDF)</p>
            <p className="mt-1 text-xs text-zinc-500">
              Fetched: 2026-01-02
            </p>
            <a
              className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
              href="https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf"
            >
              Open source
            </a>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
            <p className="font-semibold text-zinc-900">Candidate list (DOCX set)</p>
            <p className="mt-1 text-xs text-zinc-500">
              Fetched: 2026-01-02
            </p>
            <a
              className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
              href="https://baochinhphu.vn/danh-sach-868-nguoi-ung-cu-dbqh-khoa-xv-102291334.htm"
            >
              Open source
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
