## Plan: Add election results (NA15-2021)

1. Clarify scope and data model
   - Decide what "results" means for this site (elected list only vs. vote totals if any).
   - Define fields needed in JSON (e.g., person_id/entry_id linkage, constituency, seat status, notes, source citations).
   - Confirm source hierarchy and citation format for each field.

2. Collect + normalize source data
   - Pull official lists from noted sources in `data/na15-2021/results/README.md`.
   - Normalize names/IDs to match existing candidates data (folded name, constituency, unit number).
   - Document any ambiguities (e.g., ineligible seat) in a structured notes field.

3. Extend staging DB + pipeline
   - Add results tables in `data/staging.db` (e.g., results, result_sources).
   - Update `build-staging-db.py` to ingest results data.
   - Add QA checks in `qa-checks.py` (linkage to candidates, duplicate detection, missing sources).
   - Update `export-json.py` to emit `public/data/elections/na15-2021/results.json` (and optional per-entry results).

4. Update UI + routes
   - Add a results overview page under `app/elections/[cycle]/results/page.tsx`.
   - Add links on cycle overview and candidate detail pages when results exist.
   - Provide bilingual labels + methodology note and show sources.

5. Verify + document
   - Regenerate data with `npm run data:build`.
   - Spot-check a few entries against sources.
   - Update `README.md` + `data/na15-2021/README.md` with the new results pipeline and outputs.

## Progress update (2026-01-09)

- Research artifacts created in `data/na15-2021/results/`:
  - `research.py` pulls the CEMA bulletin + VTV report from Wayback and writes `research.json` + `research.md`.
  - `cema-district-results.json` + `cema-district-results.csv` parsed from the CEMA bulletin, capturing per-province/constituency vote totals for each listed candidate.
- Staging DB changes in `data/na15-2021/build-staging-db.py`:
  - Added `election_result_candidate` table to store results (votes, percent, unit info, optional links to candidates/constituencies).
  - Added the CEMA bulletin as a `document` and inserted per-record `source` rows.
  - Added loader `load_cema_results(...)` to ingest `cema-district-results.json`, map localities/constituencies, and match candidate entries by folded name.
  - Loader runs as part of `npm run data:build` (after candidates are loaded).
- Note: the CEMA bulletin lists all 866 candidates with vote totals; current import inserts one row per candidate (not only confirmed winners).

- Matching improvements:
  - Match tries exact folded name within constituency, then cycle-wide fallback.
  - Added LIKE-based fallback (`prefix`, `suffix`, `contains`) with notes.
  - Parenthetical aliases handled: match real name first, then alias in parentheses if needed.
  - Notes capture `constituency_mismatch` or `alias_*` when used.

- QA:
  - `data/na15-2021/qa-checks.py` now errors if any `election_result_candidate` rows lack a `candidate_entry_id`.

## Current state + remaining work

### What’s done
- Research artifacts + CEMA per-candidate results parsed and ingested into `staging.db`.
- Matching logic improved; all `election_result_candidate` rows now link to a `candidate_entry_id`.
- QA check added to enforce results-to-candidate linkage.

### Open questions (need your answers)
- Should results be shown in the UI only after constituency sources are wired, or can we ship UI without them?

### Decisions made
- Ingest CEMA results into staging as `election_result_candidate` (all 866 candidates).
- Matching logic: exact -> LIKE -> cycle-wide fallback; parenthetical aliases used as fallback; mismatch notes captured.
- Export **all candidates** with vote totals.
- Results table should be **separate** and appear **above** candidate details on the constituency page.
- Results UI should be **bilingual**.
- Export format: **single** `results.json` per cycle.

## Milestones (approval required to advance)

### Milestone 0: Constituency sources wiring (blocking UI)
- Decide and ingest constituency-level sources into `staging.db`.
- Add exports for constituency sources to `public/data/elections/na15-2021/`.

### Milestone 1: Results export schema + JSON outputs
- Define export format (cycle-level summary + per-candidate vote rows).
- Implement export in `data/na15-2021/export-json.py`.
- Output to `public/data/elections/na15-2021/` (new `results.json` or similar).

### Milestone 2: UI integration
- Add results overview page (e.g., `/elections/[cycle]/results`).
- Add results table above candidate details on constituency page.
- Display source citations where available (after Milestone 0).

### Milestone 3: Docs + QA polish
- Update `README.md` + `data/na15-2021/README.md`.
- Add any extra QA checks (e.g., winner counts if filtered).

## Next step (awaiting your answers + approval)
- Confirm approval to proceed with Milestone 0 (constituency sources wiring).

## Milestone 0 progress
- Added constituency + district source rows pointing at the congressional units PDF.
- Export now includes `sources` for constituency and constituency_district records.
- Data rebuild completed; sources now materialized in `staging.db` and `public/data/`.
