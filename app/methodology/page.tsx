export default function MethodologyPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Methodology</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">How this directory is built</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Vietnam Elections is a static directory derived from official sources. It is
          not a news product and does not add commentary or rankings.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Du lieu duoc tong hop tu tai lieu chinh thuc, khong binh luan hay xep hang.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Pipeline</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
          Quy trinh du lieu
        </p>
        <ol className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>1) Collect official PDFs/DOCX files and store raw copies.</li>
          <li>2) Normalize tables into a staging SQLite database.</li>
          <li>3) Export JSON for the static site (search index + detail pages).</li>
          <li>4) Publish with timestamps and source links.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Integrity checks</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
          Kiem tra chat luong
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>Foreign key checks on the staging database.</li>
          <li>Duplicate detection by name + locality.</li>
          <li>Required field checks for candidate entries.</li>
          <li>Source coverage checks for each entry.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Field notes</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
          Ghi chu truong du lieu
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>General education uses the Vietnamese grade system (12/12 = completed high school; 10/10 = older system).</li>
        </ul>
      </section>
    </div>
  );
}
