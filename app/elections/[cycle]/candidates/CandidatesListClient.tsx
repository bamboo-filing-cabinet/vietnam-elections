"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type CandidateIndexRecord = {
  entry_id: string;
  name_vi: string;
  name_folded: string;
  locality_vi: string | null;
  locality_folded: string | null;
  constituency_vi: string | null;
  constituency_folded: string | null;
  unit_number: number | null;
  list_order: number | null;
};

type CandidatesIndexPayload = {
  cycle_id: string;
  generated_at: string;
  records: CandidateIndexRecord[];
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

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

export default function CandidatesListClient({ cycle }: { cycle?: string }) {
  const params = useParams();
  const routeCycle =
    typeof params.cycle === "string"
      ? params.cycle
      : Array.isArray(params.cycle)
        ? params.cycle[0]
        : "";
  const activeCycle = cycle || routeCycle;
  const [payload, setPayload] = useState<CandidatesIndexPayload | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!activeCycle) {
      return;
    }
    let active = true;
    const url = `${basePath}/data/elections/${activeCycle}/candidates_index.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data: CandidatesIndexPayload) => {
        if (active) {
          setPayload(data);
        }
      })
      .catch(() => {
        if (active) {
          setPayload(null);
        }
      });
    return () => {
      active = false;
    };
  }, [activeCycle]);

  const filtered = useMemo(() => {
    if (!payload) {
      return [];
    }
    const term = foldTerm(query);
    if (!term) {
      return payload.records;
    }
    return payload.records.filter((record) => {
      const haystack = [
        record.name_folded,
        record.locality_folded,
        record.constituency_folded,
      ]
        .filter(Boolean)
        .join(" ");
      return haystack.includes(term);
    });
  }, [payload, query]);

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {payload?.cycle_id ?? activeCycle}
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Candidates</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Search candidates by name, locality, or constituency.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Tim theo ho ten, dia phuong, hoac don vi bau cu.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-400 focus:outline-none"
            placeholder="Search name, locality, constituency"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500">
            {payload ? filtered.length.toLocaleString() : "—"} results
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        {!payload && (
          <p className="text-sm text-zinc-500">Loading candidate directory...</p>
        )}
        {payload && (
          <div className="grid gap-3">
            {filtered.map((record) => (
              <Link
                key={record.entry_id}
                href={`/elections/${activeCycle}/candidates/${record.entry_id}`}
                className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-900">
                    {record.name_vi}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {record.locality_vi ?? "Unknown locality"} ·{" "}
                    {record.constituency_vi ?? "Unknown constituency"}
                  </span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-zinc-500">No matches found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
