# Constituencies page: evaluation + plan

## Initial Prompt

I was thinking that constituencies also need a page, at the very least so that candidates can be viewed together as like a table and easy to compare. Evaluate this idea and use ai/SCRATCHPAD.md to keep notes, track what needs to be changed and what has been track, open questions, decisions, and plan in milestones if needed on what to be changed. Remember to ask for my answers to open questions, and also my approval first before moving from one milestone to another.

## Idea evaluation (first pass)
- Value: High. A constituency page enables side-by-side candidate comparison, improves discoverability, and supports filtering/sorting by party, status, gender, age, etc.
- Risks: Data completeness (missing candidate fields), inconsistency across elections, and UI complexity if too many columns.
- Scope suggestion: Start with a minimal table + filters for a single election/region, then expand.

## What needs to change
- Data model: confirm how constituencies are represented and linked to candidates.
- Routing: add a new route for constituencies (list + detail or list-only).
- UI: build a table view with sortable columns and basic filters.
- Content: add context copy and source notes.

## Tracked items
- Reviewed existing constituencies list page: `app/elections/[cycle]/constituencies/page.tsx` + `ConstituenciesClient.tsx`.
- Reviewed candidate detail page and static JSON pattern: `app/elections/[cycle]/candidates/[entryId]/page.tsx`.
- Reviewed data pipeline (raw -> staging DB -> JSON exports) and data schema in `data/na15-2021/README.md`, `data/na15-2021/build-staging-db.py`, `data/na15-2021/export-json.py`.
- Reviewed styling guidance: `docs/style-guide.md` and `ai/2026-01-04.01.style-and-theme.md`.

## Open questions (need user answers)
- None outstanding.

## Decisions
- Election coverage: na15-2021 only for now.
- Table columns: include all available candidate fields in the schema (within this election), rather than a minimal subset.
- URL structure: `/constituencies` and `/constituencies/[id]`.
- Visuals: match current styling.
- Filters: defer to a later milestone.
- Sorting: use existing `list_order` as default; add header sorting in a later milestone.
- Scope: keep existing list page, add constituency detail page only.
- Data build process: raw files in `data/` -> `data/staging.db` -> JSON exports in `public/data/` using `build-staging-db.py` + `export-json.py`.
- Constituency detail data sources: `public/data/elections/na15-2021/constituencies.json`, `public/data/elections/na15-2021/candidates_index.json`, and per-entry files in `public/data/elections/na15-2021/candidates_detail/`.
- Static params: generate from constituency IDs in `constituencies.json` for cycle `na15-2021`.

## Plan (milestones with checkboxes)
### M1: Inspect current data + routing structure and propose page structure
- [x] Review existing constituencies list page.
- [x] Review candidate detail page pattern.
- [x] Review data pipeline and exports.
- [x] Review style guidance.

### M2: Define constituency detail data loading approach + file layout
- [x] Decide data sources (constituencies.json + candidates_index.json + candidates_detail/*.json).
- [x] Confirm static params generation strategy.
- [x] Define payload shape to pass into the page/table.

### M3: Build constituency detail route + server-side data assembly
- [x] Add `app/elections/[cycle]/constituencies/[constituencyId]/page.tsx`.
- [x] Implement `generateStaticParams` for constituency IDs.
- [x] Implement server-side data loader and notFound handling.

### M3.1: Add navigation links from constituency list to detail page
- [x] Link each constituency card to its detail page.

### M4: Render comparison table (all candidate fields) + base layout
- [x] Build page header (cycle, locality, constituency, seats, districts).
- [x] Render candidates table (all fields from schema).
- [x] Default sort uses `list_order`.
- [x] Ensure layout matches existing theme.

### M5: Polish (copy, empty states, accessibility, table styling)
- [x] Empty state for missing constituency/candidates.
- [x] Table header styling + zebra rows + responsive scroll.
- [x] Accessibility checks (labels, table semantics).

### M5.1: Table usability tweaks (requested)
- [x] Move candidate name to be the first column after list order.
- [x] Fix horizontal scrolling behavior in the table container.

### M5.2: Chrome scroll affordance tweaks
- [x] Add horizontal scroll hint and touch-pan-x for the table container.
- [x] Stabilize scrollbars to avoid layout shifts.

### M5.3: Force horizontal overflow for comparison table
- [x] Prevent table cells from wrapping to ensure horizontal scroll.
- [x] Add truncation + hover titles for long values.

### M5.4: Add drag-to-scroll fallback
Status: Skipped (user prefers fewer client-side changes).

### M5.4: Column sizing + forced overflow (CSS-only)
- [x] Force minimum column widths so the table overflows horizontally.
- [x] Keep truncation + hover titles for long values.

### M5.5: Contain overflow within table section
- [x] Add `min-w-0` to the table section/wrapper so grid items can shrink.
- [x] Ensure the horizontal scrollbar belongs to the table container only.

## Approval checkpoints
- Need approval before moving from M1 → M2 and M2 → M3.
