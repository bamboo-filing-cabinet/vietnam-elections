# Vietnam Elections — Scratchpad

## Phases / Milestones — Status and Remaining Work

### Phase 0 — Repo + Deploy Skeleton
- [x] Repo has a Next.js App Router scaffold (`app/`, `package.json`)
- [x] Configure static export for GitHub Pages in `next.config.ts` (basePath/assetPrefix, `images.unoptimized`, `trailingSlash`)
- [x] Replace `app/page.tsx` with project home (non-starter content)
- [x] Add minimal navigation shell in `app/layout.tsx`
- [x] Add stub pages for nav routes (`/elections`, `/methodology`, `/sources`, `/disclaimer`)

### Phase 1 — 2021 Data Readiness (NA15)
- [x] 2021 NA15 data inventory present in `data/na-15-2021/`
- [x] Constituency list parsed to CSV (`congressional-units-parsed.csv`)
- [x] Candidate list extracted to CSVs (`data/na-15-2021/candidates-list/*.csv`)
- [x] SQLite staging database exists (`data/na-15-2021/staging.db`)
- [x] Verify staging schema aligns with plan tables (cycle/locality/constituency/person/entry/source/document)
- [x] Document provenance for each dataset in `data/na-15-2021/README.md` (source URL + fetched date)

### Phase 2 — Data Pipeline + JSON Exports (Build-time)
- [x] Define canonical JSON shapes (candidates index/detail, localities, constituencies, documents, timeline, changelog)
- [x] Implement export script from `data/na-15-2021/staging.db` to `public/data/`
- [x] Add folded fields for search (accent-insensitive)
- [x] JSON exports generated in `public/data/elections/na15-2021/`
- [ ] Add QA checks for staging (missing sources, broken FKs, duplicates, missing key fields)
- [ ] Wire exports into `npm run build` or a separate `npm run data:build`

### Phase 3 — Single-cycle MVP Pages (2021)
- [ ] Elections overview page for cycle `na-15-2021`
- [ ] Candidates list page using `candidates_index.json`
- [ ] Candidate detail page using per-entry JSON
- [ ] Client-side search/filter (name/locality/constituency)
- [ ] Sources + last-updated UI on detail pages

### Phase 4 — Multi-cycle Support
- [ ] Elections index page listing cycles
- [ ] Per-cycle routing + navigation
- [ ] Add second cycle dataset to validate routing

### Phase 5 — Policy + Hardening
- [ ] Methodology page
- [ ] Sources registry page
- [ ] Changelog page
- [ ] Disclaimer, privacy, terms pages
- [ ] Accessibility + performance pass

### Phase 6 — Optional People Pages (Cross-cycle)
- [ ] Define stable `person_id` strategy
- [ ] Add `people_index.json` + person detail pages

## Notes / Open Questions

- JSON exports chosen (static hosting + client search).
  - JSON exports pros: simple hosting on GitHub Pages, easy client-side search, static data files for reuse, no SQLite dependency in app.
  - JSON exports cons: extra build step, duplication of data, need to keep export schema stable.
- Canonical candidate fields: start minimal; expand as sources reveal more.
- Changelog scope: per-entry change history preferred.
- Export destination: `public/data/`.
- Search index fields: name + locality + constituency (folded).
- Current exports have empty `sources` arrays and `changelog` entries; citations + diffs still need plumbing.
