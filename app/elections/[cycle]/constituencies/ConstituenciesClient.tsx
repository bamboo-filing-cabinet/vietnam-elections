"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type District = {
  name_vi: string;
  name_folded: string;
};

type ConstituencyRecord = {
  id: string;
  locality_id: string;
  unit_number: number | null;
  seat_count: number | null;
  name_vi: string;
  name_folded: string;
  description: string | null;
  unit_context_raw: string | null;
  districts: District[];
};

type ConstituencyPayload = {
  cycle_id: string;
  generated_at: string;
  records: ConstituencyRecord[];
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type LocalityPayload = {
  cycle_id: string;
  generated_at: string;
  records: Array<{
    id: string;
    name_vi: string;
    name_folded: string;
    type: string;
  }>;
};

function foldTerm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ConstituenciesClient({ cycle }: { cycle?: string }) {
  const params = useParams();
  const routeCycle =
    typeof params.cycle === "string"
      ? params.cycle
      : Array.isArray(params.cycle)
        ? params.cycle[0]
        : "";
  const activeCycle = cycle || routeCycle;
  const [payload, setPayload] = useState<ConstituencyPayload | null>(null);
  const [localities, setLocalities] = useState<LocalityPayload | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("all");

  useEffect(() => {
    if (!activeCycle) {
      return;
    }
    let active = true;
    const url = `${basePath}/data/elections/${activeCycle}/constituencies.json`;
    const localityUrl = `${basePath}/data/elections/${activeCycle}/localities.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load data");
        }
        return res.json();
      })
      .then((data: ConstituencyPayload) => {
        if (active) {
          setPayload(data);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (active) {
          setPayload(null);
          setLoadError(true);
        }
      });
    fetch(localityUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load localities");
        }
        return res.json();
      })
      .then((data: LocalityPayload) => {
        if (active) {
          setLocalities(data);
        }
      })
      .catch(() => {
        if (active) {
          setLocalities(null);
        }
      });
    return () => {
      active = false;
    };
  }, [activeCycle]);

  const localityOptions = useMemo(() => {
    if (!payload) {
      return [];
    }
    const map = new Map<string, string>();
    localities?.records.forEach((record) => {
      map.set(record.id, record.name_vi);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));
  }, [localities, payload]);

  const filtered = useMemo(() => {
    if (!payload) {
      return [];
    }
    const term = foldTerm(query);
    return payload.records.filter((record) => {
      const localityMatch = selectedLocality === "all" || record.locality_id === selectedLocality;
      const districtText = record.districts.map((d) => d.name_folded).join(" ");
      const haystack = [record.name_folded, record.description, districtText]
        .filter(Boolean)
        .join(" ");
      const queryMatch = term ? haystack.includes(term) : true;
      return localityMatch && queryMatch;
    });
  }, [payload, query, selectedLocality]);

  const sorted = useMemo(() => {
    const localityName = (localityId: string) =>
      localities?.records.find((loc) => loc.id === localityId)?.name_vi ?? localityId;
    return filtered.slice().sort((a, b) => {
      const localityCompare = localityName(a.locality_id).localeCompare(
        localityName(b.locality_id)
      );
      if (localityCompare !== 0) {
        return localityCompare;
      }
      return (a.unit_number ?? 0) - (b.unit_number ?? 0);
    });
  }, [filtered, localities]);

  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">
          {payload?.cycle_id ?? activeCycle}
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--ink)]">Constituencies</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Browse constituencies and their district coverage for each locality.
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Danh sách đơn vị bầu cử và các quận/huyện thuộc phạm vi.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            <input
              className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none"
              placeholder="Search constituency or district"
              aria-label="Search constituencies"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-muted)]">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">Locality</span>
            <select
              className="bg-transparent text-sm text-[var(--ink)] focus:outline-none"
              aria-label="Filter by locality"
              value={selectedLocality}
              onChange={(event) => setSelectedLocality(event.target.value)}
            >
              <option value="all">All</option>
              {localityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink-muted)]">
            {payload ? filtered.length.toLocaleString() : "—"} results
          </div>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        {!payload && !loadError && (
          <p className="text-sm text-[var(--ink-muted)]">Loading constituencies...</p>
        )}
        {loadError && (
          <p className="text-sm text-[var(--ink-muted)]">
            Constituency data is not yet available for this cycle.
          </p>
        )}
        {payload && (
          <div className="grid gap-3">
            {sorted.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {(() => {
                      const localityName =
                        localities?.records.find((loc) => loc.id === record.locality_id)
                          ?.name_vi ?? record.locality_id;
                      return (
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {localityName} · {record.name_vi}
                        </p>
                      );
                    })()}
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">
                      Locality:{" "}
                      {localities?.records.find((loc) => loc.id === record.locality_id)
                        ?.name_vi ?? record.locality_id}{" "}
                      · Seats: {record.seat_count ?? "—"}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
                    Unit {record.unit_number ?? "—"}
                  </span>
                </div>
                {record.districts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.districts.map((district) => (
                      <span
                        key={district.name_folded}
                        className="rounded-full border-2 border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                      >
                        {district.name_vi}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sorted.length === 0 && (
              <p className="text-sm text-[var(--ink-muted)]">No matches found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
