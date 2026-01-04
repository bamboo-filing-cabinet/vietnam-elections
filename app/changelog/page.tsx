export default function ChangelogPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Changelog</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Update history</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Changelog entries will appear here once change tracking is enabled for each
          candidate record.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Nhat ky thay doi se duoc bo sung khi co theo doi cap nhat.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Status</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Trang thai</p>
        <p className="mt-4 text-sm text-zinc-600">
          Change tracking is planned but not yet populated in the dataset.
        </p>
      </section>
    </div>
  );
}
