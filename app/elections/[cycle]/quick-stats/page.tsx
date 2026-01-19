import { notFound } from "next/navigation";
import CycleNav from "../CycleNav";

const SUPPORTED_CYCLES = ["na15-2021", "na16-2026"];

const quickStats = {
  "na15-2021": {
    kpis: [
      { label: "Total candidates", value: "868", sublabel: "Roster" },
      { label: "Total winners", value: "500", sublabel: "Results (won)" },
      { label: "Constituencies", value: "186" },
      { label: "Localities", value: "63" },
      { label: "Avg candidates/const.", value: "4.72" },
      { label: "Avg age", value: "45.47 / 49.28", sublabel: "Candidates / winners" },
    ],
    seatDistributionFull: [
      "30 seats: 1 (TP. Hồ Chí Minh)",
      "29 seats: 1 (TP. Hà Nội)",
      "14 seats: 1 (Tỉnh Thanh Hóa)",
      "13 seats: 1 (Tỉnh Nghệ An)",
      "12 seats: 2 (Tỉnh Bắc Kạn, Tỉnh Đồng Nai)",
      "11 seats: 1",
      "9 seats: 6",
      "8 seats: 7",
      "7 seats: 17",
      "6 seats: 26",
    ],
    ageSummary: {
      candidates: { average: "45.47", median: "45" },
      winners: { average: "49.28", median: "50" },
      oldestWinners: [
        "Nguyễn Phú Trọng — 77 (TP. Hà Nội, unit 1)",
        "Nguyễn Chu Hồi — 69 (TP. Hải Phòng, unit 2)",
        "Trương Trọng Nghĩa — 68 (TP. Hồ Chí Minh, unit 8)",
        "Võ Văn Kim (Vũ Trọng Kim) — 68 (Tỉnh Nam Định, unit 3)",
        "Nguyễn Thiện Nhân — 67 (TP. Hồ Chí Minh, unit 6)",
      ],
      youngestWinners: [
        "Quàng Thị Nguyệt — 23 (Tỉnh Điện Biên, unit 1)",
        "Nàng Xô Vi — 25 (Tỉnh Kon Tum, unit 1)",
        "Trần Thị Quỳnh — 28 (Tỉnh Nam Định, unit 3)",
        "Hà Ánh Phượng — 29 (Tỉnh Phú Thọ, unit 1)",
        "Phạm Thị Xuân — 29 (Tỉnh Thanh Hóa, unit 5)",
      ],
    },
    topVotes: [
      "Ông Nguyễn Xuân Phúc — 622,984 (TP. Hồ Chí Minh, unit 10)",
      "Ông Nguyễn Phú Trọng — 557,717 (TP. Hà Nội, unit 1)",
      "Bà Nguyễn Thị Lệ — 550,676 (TP. Hồ Chí Minh, unit 10)",
      "Ông Thái Thanh Quý — 529,035 (Tỉnh Nghệ An, unit 4)",
      "Ông Đào Ngọc Dung — 522,538 (Tỉnh Thanh Hóa, unit 3)",
    ],
    bottomVotesWinners: [
      "Ông Hoàng Văn Hữu — 63,511 (Tỉnh Bắc Kạn, unit 2)",
      "Ông Hà Sỹ Huân — 63,593 (Tỉnh Bắc Kạn, unit 1)",
      "Bà Nguyễn Thị Huế — 69,683 (Tỉnh Bắc Kạn, unit 2)",
      "Bà Nguyễn Thị Thủy — 72,606 (Tỉnh Bắc Kạn, unit 1)",
      "Bà Hồ Thị Kim Ngân — 74,093 (Tỉnh Bắc Kạn, unit 1)",
    ],
    topPercent: [
      "Ông Vương Đình Huệ — 99.89% (TP. Hải Phòng, unit 3)",
      "Ông Phạm Minh Chính — 98.74% (TP. Cần Thơ, unit 1)",
      "Bà Nguyễn Thị Thu Hà — 98.38% (Tỉnh Ninh Bình, unit 1)",
      "Ông Tô Lâm — 98.36% (Tỉnh Hưng Yên, unit 1)",
      "Ông Lương Văn Cường (Lương Cường) — 97.72% (Tỉnh Thanh Hóa, unit 2)",
    ],
    bottomPercentWinners: [
      "Bà Trần Khánh Thu — 50.02% (Tỉnh Thái Bình, unit 1)",
      "Ông Đỗ Ngọc Thịnh — 50.13% (Tỉnh Khánh Hòa, unit 2)",
      "Bà Phạm Thị Minh Huệ — 51.53% (Tỉnh Sóc Trăng, unit 1)",
      "Ông Dương Bình Phú — 51.90% (Tỉnh Phú Yên, unit 1)",
      "Ông Hoàng Văn Hữu — 52.99% (Tỉnh Bắc Kạn, unit 2)",
    ],
    gapVotesLargest: [
      "TP. Hải Phòng, unit 3 — 450,906",
      "Tỉnh Thanh Hóa, unit 1 — 437,735",
      "TP. Hải Phòng, unit 1 — 433,400",
      "Tỉnh Thanh Hóa, unit 2 — 430,469",
      "Tỉnh Thanh Hóa, unit 4 — 390,733",
    ],
    gapVotesSmallest: [
      "Tỉnh Bắc Kạn, unit 2 — 197",
      "Tỉnh Trà Vinh, unit 2 — 1,221",
      "TP. Hồ Chí Minh, unit 8 — 1,510",
      "Tỉnh Phú Yên, unit 1 — 2,172",
      "Tỉnh Phú Yên, unit 2 — 3,720",
    ],
    gapPercentLargest: [
      "TP. Hải Phòng, unit 3 — 90.19 pp",
      "Tỉnh Hà Tĩnh, unit 2 — 87.24 pp",
      "Tỉnh Hà Tĩnh, unit 3 — 86.74 pp",
      "Tỉnh Ninh Bình, unit 2 — 86.23 pp",
      "Tỉnh Hưng Yên, unit 1 — 83.14 pp",
    ],
    gapPercentSmallest: [
      "Tỉnh Bắc Kạn, unit 2 — 0.16 pp",
      "TP. Hồ Chí Minh, unit 8 — 0.27 pp",
      "Tỉnh Trà Vinh, unit 2 — 0.28 pp",
      "Tỉnh Phú Yên, unit 1 — 0.59 pp",
      "Tỉnh Phú Yên, unit 2 — 1.06 pp",
    ],
    localitiesMostCandidates: [
      "TP. Hồ Chí Minh 50",
      "TP. Hà Nội 49",
      "Tỉnh Thanh Hóa 24",
      "Tỉnh Nghệ An 23",
      "Tỉnh Đồng Nai 20",
    ],
    localitiesFewestCandidates:
      "10 each (26 localities): TP. Đà Nẵng; Tỉnh Bà Rịa - Vũng Tàu; Tỉnh Bình Phước; Tỉnh Bạc Liêu; Tỉnh Bắc Kạn; Tỉnh Cao Bằng; Tỉnh Hà Giang; Tỉnh Hà Nam; Tỉnh Hòa Bình; Tỉnh Hậu Giang; Tỉnh Kon Tum; Tỉnh Lai Châu; Tỉnh Lào Cai; Tỉnh Lạng Sơn; Tỉnh Ninh Bình; Tỉnh Ninh Thuận; Tỉnh Phú Yên; Tỉnh Quang Bình; Tỉnh Quảng Trị; Tỉnh Trà Vinh; Tỉnh Tây Ninh; Tỉnh Vĩnh Long; Tỉnh Vĩnh Phúc; Tỉnh Yên Bái; Tỉnh Điện Biên; Tỉnh Đắk Nông.",
    localitiesFewestSeats:
      "6 seats each (26 localities). Example bottom 5: TP. Đà Nẵng; Tỉnh Bà Rịa - Vũng Tàu; Tỉnh Bạc Liêu; Tỉnh Bình Phước; Tỉnh Cao Bằng.",
    demographics: {
      gender: "Nam 475; Nữ 393.",
      ethnicitySplit: "Kinh 683 (78.69%); non-Kinh 185 (21.31%).",
      ethnicityCounts:
        "Kinh 683; Tày 32; Thái 19; Mường 17; Mông 11; Khmer 9; Hoa 7; Nùng 7; Dao 5; Ê-đê 5; Chăm 4; Cơ - ho 4; HMông 4; Sán Dìu 4; Jrai 3; Lào 3; Bahnar 2; Châu Mạ 2; Cơ tu 2; Hre 2; Khơ-mú 2; M`nông 2; Mnông 2; Ra-Glay 2; Thổ 2; Vân Kiều 2; Bana 1; Banar 1; Brâu 1; Cao Lan 1; Cao Lan (Sán Chay) 1; Chơ ro 1; Chơ-ro 1; Co 1; Cơ-tu 1; Gia Rai 1; Giáy 1; Hà Nhì 1; Ka dong 1; Khơme 1; Kor 1; La Chí 1; Lự 1; Mạ 1; Mảng 1; Ngái 1; Pa Cô 1; Pà Thẻn 1; Ra-Glai 1; Stiêng 1; Sán Chay 1; Sán Chay (Cao Lan) 1; S’tiêng 1; Triêng 1; Tà-ôi 1; Xơ Đăng 1; Xơ-đăng (Ca Dong) 1.",
      religion:
        "Không 845 (97.35%); Phật giáo 10 (1.15%); Công giáo 4 (0.46%); Bà la môn 2 (0.23%); Thiên chúa giáo 1 (0.12%); Phật giáo, Thượng tọa 1 (0.12%); Phật 1 (0.12%); Cao Đài 1 (0.12%); Bà ni 1 (0.12%); Balamôn 1 (0.12%); (empty) 1 (0.12%).",
    },
    education: {
      general:
        "12/12 762 (87.79%); 10/10 88 (10.14%); 12/12 bổ túc 14 (1.61%); 09/12 1 (0.12%); 11/12 1 (0.12%); 12/12 Bổ túc 1 (0.12%); 9/12 1 (0.12%).",
      political:
        "Cao cấp 587 (67.63%); Trung cấp 111 (12.79%); - 66 (7.60%); Cử nhân 55 (6.34%); Sơ cấp 35 (4.03%); Không 9 (1.04%); Cử nhân, Cao cấp 2 (0.23%); Cử nhân chính trị 1 (0.12%); Thạc sĩ 1 (0.12%); Đang học Trung cấp 1 (0.12%).",
      academicMentions: "Tiến sĩ 169; Giáo sư 43; Phó giáo sư 27.",
      academicFolded:
        "Thạc sĩ 385; Cử nhân 266; Tiến sĩ 125; Phó Giáo sư, Tiến sĩ 27; Giáo sư, Tiến sĩ 15; Kỹ sư 15; Bác sĩ 7; Bác sĩ chuyên khoa cấp I 3; Bác sĩ chuyên khoa I 3; Bác sĩ chuyên khoa II 3; Kỹ sư, cử nhân 3; Bác sĩ chuyên khoa cấp II 1; Cao đẳng 1; Cử nhân, Kỹ sư 1; Giáo sư kinh tế, Tiến sĩ 1; Kiến trúc sư 1; Tiến sĩ, Bác sĩ chuyên khoa II 1.",
      academicMissing: "10 candidates without `education_academic_rank`.",
    },
    irregularities: {
      notConfirmed:
        "Trần Văn Nam (Trần Quốc Tuấn), Tỉnh Bình Dương, unit 1 — status not_confirmed; notes “Per VTV report”.",
      constituencyMismatch:
        "Bà Châu Quỳnh Dao (Kiên Giang unit 3 → unit 1); Ông Nguyễn Văn Hùng (Kon Tum unit 2 → unit 1); Ông Phạm Đình Thanh (Kon Tum unit 2 → unit 1); Bà Trần Thị Thu Phước (Kon Tum unit 1 → unit 2); Ông Tô Văn Tám (Kon Tum unit 1 → unit 2); Bà Nguyễn Thị Tuyết Nga (Quang Bình unit 2 → unit 1); Bà Đoàn Thị Thanh Tâm (Quang Bình unit 2 → unit 1); Ông Nguyễn Tiến Nam (Quang Bình unit 2 → unit 1); Ông Phạm Trọng Tiến (Quang Bình unit 2 → unit 1); Ông Trần Quang Minh (Quang Bình unit 2 → unit 1); Bà Nguyễn Minh Tâm (Quang Bình unit 1 → unit 2); Bà Nguyễn Thị Kim Sinh (Quang Bình unit 1 → unit 2); Bà Nguyễn Thị Lệ Quyên (Quang Bình unit 1 → unit 2); Ông Nguyễn Mạnh Cường (Quang Bình unit 1 → unit 2); Ông Vũ Đại Thắng (Quang Bình unit 1 → unit 2).",
    },
  },
};

function StatList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 text-sm text-[var(--ink)]">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          <span className="text-[var(--ink-muted)]">{index + 1}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export async function generateStaticParams() {
  return SUPPORTED_CYCLES.map((cycle) => ({ cycle }));
}

export default async function QuickStatsPage({
  params,
}: {
  params: Promise<{ cycle: string }>;
}) {
  const { cycle } = await params;
  if (!SUPPORTED_CYCLES.includes(cycle)) {
    notFound();
  }

  const stats = quickStats[cycle as keyof typeof quickStats];

  if (!stats) {
    return (
      <div className="grid gap-6">
        <CycleNav cycle={cycle} />
        <section className="rounded-3xl border-2 border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
            Coming soon
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">
            Quick stats for this cycle
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
            Quick stats will appear once data for this cycle is published.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-8 stagger">
      <CycleNav cycle={cycle} />

      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          Quick stats
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">
          NA15 (2021) quick stats
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--ink-muted)]">
          Snapshot of verified, source-linked metrics from local data. Values are
          hard-coded from the curated quick stats list.
        </p>
        <p className="mt-2 text-xs text-[var(--ink-muted)]">
          All figures are descriptive and non-evaluative.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                {kpi.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                {kpi.value}
              </p>
              {kpi.sublabel && (
                <p className="mt-1 text-xs text-[var(--ink-muted)]">{kpi.sublabel}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Seats per locality
          </h2>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            Full distribution, with top localities listed in-line.
          </p>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              Seat distribution
            </p>
            <div className="mt-2">
              <StatList items={stats.seatDistributionFull} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Age summary</h2>
          <div className="mt-4 grid gap-4 text-sm text-[var(--ink)]">
            <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Candidates
              </p>
              <p className="mt-2 font-semibold">Avg {stats.ageSummary.candidates.average}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                Median {stats.ageSummary.candidates.median}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Winners
              </p>
              <p className="mt-2 font-semibold">Avg {stats.ageSummary.winners.average}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                Median {stats.ageSummary.winners.median}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Top vote totals</h2>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            Highest vote counts in results.
          </p>
          <div className="mt-4">
            <StatList items={stats.topVotes} />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Top vote percentages</h2>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            Highest vote share in results.
          </p>
          <div className="mt-4">
            <StatList items={stats.topPercent} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Lowest winning totals
          </h2>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            Bottom 5 by vote count (status: won).
          </p>
          <div className="mt-4">
            <StatList items={stats.bottomVotesWinners} />
          </div>
          <p className="mt-6 text-xs text-[var(--ink-muted)]">
            Bottom 5 by vote percentage (status: won).
          </p>
          <div className="mt-3">
            <StatList items={stats.bottomPercentWinners} />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Won/lost gaps</h2>
          <div className="mt-4 grid gap-5 text-sm text-[var(--ink)]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Largest gaps (votes)
              </p>
              <div className="mt-3">
                <StatList items={stats.gapVotesLargest} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Smallest gaps (votes)
              </p>
              <div className="mt-3">
                <StatList items={stats.gapVotesSmallest} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Largest gaps (percent)
              </p>
              <div className="mt-3">
                <StatList items={stats.gapPercentLargest} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Smallest gaps (percent)
              </p>
              <div className="mt-3">
                <StatList items={stats.gapPercentSmallest} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Localities with most candidates
          </h2>
          <div className="mt-4">
            <StatList items={stats.localitiesMostCandidates} />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Localities with fewest candidates
          </h2>
          <p className="mt-3 text-sm text-[var(--ink)]">
            {stats.localitiesFewestCandidates}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Localities with fewest seats
          </h2>
          <p className="mt-3 text-sm text-[var(--ink)]">{stats.localitiesFewestSeats}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Gender</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">{stats.demographics.gender}</p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Ethnicity</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">
            {stats.demographics.ethnicitySplit}
          </p>
          <details className="mt-4 text-xs text-[var(--ink-muted)]">
            <summary className="cursor-pointer">Full ethnicity list</summary>
            <p className="mt-2 text-sm text-[var(--ink)]">
              {stats.demographics.ethnicityCounts}
            </p>
          </details>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Religion</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">{stats.demographics.religion}</p>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            Note: raw values include minor spelling variants and one empty entry.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">General education</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">{stats.education.general}</p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Political theory</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">{stats.education.political}</p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Academic rank</h2>
          <p className="mt-3 text-sm text-[var(--ink)]">
            Mentions: {stats.education.academicMentions}
          </p>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            {stats.education.academicMissing}
          </p>
          <details className="mt-4 text-xs text-[var(--ink-muted)]">
            <summary className="cursor-pointer">Grouped counts</summary>
            <p className="mt-2 text-sm text-[var(--ink)]">
              {stats.education.academicFolded}
            </p>
          </details>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Irregularities</h2>
        <p className="mt-3 text-sm text-[var(--ink)]">{stats.irregularities.notConfirmed}</p>
        <details className="mt-4 text-xs text-[var(--ink-muted)]">
          <summary className="cursor-pointer">Constituency mismatches (15)</summary>
          <p className="mt-2 text-sm text-[var(--ink)]">
            {stats.irregularities.constituencyMismatch}
          </p>
        </details>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6">
        <details className="text-xs text-[var(--ink-muted)]">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">
            Methodology & data notes
          </summary>
          <div className="mt-3 space-y-2 text-sm text-[var(--ink)]">
            <p>Sources: local data exports (`staging.db` and `results.json`).</p>
            <p>
              Winner/loser gaps are calculated as the lowest winning candidate minus the
              highest losing candidate in each constituency.
            </p>
            <p>
              Some categorical fields include minor spelling variants; religion values are
              presented as stored.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
