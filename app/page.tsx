export default function Home() {
  return (
    <div className="grid gap-12">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Coming soon</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-zinc-900">
          Vietnam Elections
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          A static, source-linked directory of official candidate information for Vietnam
          elections. Built for transparency and historical reference.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
          Dữ liệu bầu cử Việt Nam: thư mục tĩnh, có nguồn trích dẫn, tổng hợp thông
          tin ứng cử viên từ tài liệu chính thức.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Scope</h2>
          <p className="mt-2 text-sm text-zinc-600">
            This site documents official candidate lists by election cycle, locality,
            and constituency. No endorsements, rankings, or user comments.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Phạm vi: danh sách ứng cử viên theo kỳ bầu cử, địa phương và đơn vị bầu cử.
            Không có nhận xét, xếp hạng, hay bình luận.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>Static build, no backend.</li>
            <li>Every field tied to a source.</li>
            <li>Public change logs for updates.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Data sources</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Initial focus: 15th National Assembly (2021) candidate list and
            congressional unit documents.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Nguồn dữ liệu ban đầu: danh sách ứng cử viên Quốc hội khóa XV (2021)
            và tài liệu đơn vị bầu cử.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-xs text-zinc-500">
            Links will be published alongside the directory pages.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Status</h2>
        <p className="mt-2 text-sm text-zinc-600">
          The data pipeline is in place. The public directory UI is under construction.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Hệ thống dữ liệu đã sẵn sàng. Giao diện công bố đang được hoàn thiện.
        </p>
      </section>
    </div>
  );
}
