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

const sortOptions = [
  { value: "list", label: "List order" },
  { value: "name", label: "Name" },
  { value: "locality", label: "Locality" },
  { value: "constituency", label: "Constituency" },
];

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

function highlightMatch(text: string | null, query: string) {
  if (!text) {
    return "—";
  }
  if (!query) {
    return text;
  }
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const start = lowerText.indexOf(lowerQuery);
  if (start === -1) {
    return text;
  }
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded bg-amber-100 px-1 text-zinc-900">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
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
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("list");
  const [selectedLocality, setSelectedLocality] = useState("all");
  const [selectedConstituency, setSelectedConstituency] = useState("all");

  useEffect(() => {
    if (!activeCycle) {
      return;
    }
    let active = true;
    const url = `${basePath}/data/elections/${activeCycle}/candidates_index.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load data");
        }
        return res.json();
      })
      .then((data: CandidatesIndexPayload) => {
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
    return () => {
      active = false;
    };
  }, [activeCycle]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => {
      window.clearTimeout(handle);
    };
  }, [query]);

  const filtered = useMemo(() => {
    if (!payload) {
      return [];
    }
    const term = foldTerm(debouncedQuery);
    if (!term) {
      return payload.records.slice();
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
  }, [payload, debouncedQuery]);

  const filteredBySelect = useMemo(() => {
    return filtered.filter((record) => {
      const localityOk =
        selectedLocality === "all" ||
        record.locality_folded === selectedLocality;
      const constituencyOk =
        selectedConstituency === "all" ||
        record.constituency_folded === selectedConstituency;
      return localityOk && constituencyOk;
    });
  }, [filtered, selectedConstituency, selectedLocality]);

  const sorted = useMemo(() => {
    const records = filteredBySelect.slice();
    records.sort((a, b) => {
      if (sortBy === "name") {
        return a.name_folded.localeCompare(b.name_folded);
      }
      if (sortBy === "locality") {
        return (a.locality_folded || "").localeCompare(b.locality_folded || "");
      }
      if (sortBy === "constituency") {
        return (a.constituency_folded || "").localeCompare(b.constituency_folded || "");
      }
      const orderA = a.list_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.list_order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name_folded.localeCompare(b.name_folded);
    });
    return records;
  }, [filteredBySelect, sortBy]);

  const localityOptions = useMemo(() => {
    if (!payload) {
      return [];
    }
    const map = new Map<string, string>();
    payload.records.forEach((record) => {
      if (record.locality_folded && record.locality_vi) {
        map.set(record.locality_folded, record.locality_vi);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));
  }, [payload]);

  const constituencyOptions = useMemo(() => {
    if (!payload) {
      return [];
    }
    const map = new Map<string, string>();
    payload.records.forEach((record) => {
      const localityMatch =
        selectedLocality === "all" || record.locality_folded === selectedLocality;
      if (!localityMatch) {
        return;
      }
      if (record.constituency_folded && record.constituency_vi) {
        map.set(record.constituency_folded, record.constituency_vi);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));
  }, [payload, selectedLocality]);

  useEffect(() => {
    setSelectedConstituency("all");
  }, [selectedLocality]);

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
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
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2">
            <input
              className="w-full text-sm focus:outline-none"
              placeholder="Search name, locality, constituency"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Locality</span>
            <select
              className="bg-transparent text-sm text-zinc-700 focus:outline-none"
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
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Constituency</span>
            <select
              className="bg-transparent text-sm text-zinc-700 focus:outline-none"
              value={selectedConstituency}
              onChange={(event) => setSelectedConstituency(event.target.value)}
            >
              <option value="all">All</option>
              {constituencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Sort</span>
            <select
              className="bg-transparent text-sm text-zinc-700 focus:outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500">
            {payload
              ? `${sorted.length.toLocaleString()} / ${payload.records.length.toLocaleString()}`
              : "—"}{" "}
            results
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        {!payload && !loadError && (
          <p className="text-sm text-zinc-500">Loading candidate directory...</p>
        )}
        {loadError && (
          <p className="text-sm text-zinc-500">
            Candidate data is not yet available for this cycle.
          </p>
        )}
        {payload && (
          <div className="grid gap-3">
            {sorted.map((record) => (
              <Link
                key={record.entry_id}
                href={`/elections/${activeCycle}/candidates/${record.entry_id}`}
                className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-900">
                    {highlightMatch(record.name_vi, debouncedQuery)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {highlightMatch(record.locality_vi, debouncedQuery)} ·{" "}
                    {highlightMatch(record.constituency_vi, debouncedQuery)}
                  </span>
                </div>
              </Link>
            ))}
            {sorted.length === 0 && (
              <p className="text-sm text-zinc-500">No matches found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
