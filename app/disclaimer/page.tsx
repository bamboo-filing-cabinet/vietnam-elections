export default function DisclaimerPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Disclaimer</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Neutral, sourced directory</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Vietnam Elections is an informational directory based on official sources. It
          does not provide endorsements, rankings, or commentary.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Du lieu mang tinh thong tin, khong co nhan xet hay xep hang.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Limitations</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
          Gioi han su dung
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-zinc-600">
          <li>Data reflects the state of the sources at the time of collection.</li>
          <li>Errors may exist in source documents; corrections are welcome.</li>
          <li>This site does not solicit or publish user submissions.</li>
        </ul>
      </section>
    </div>
  );
}
