# Candidate Status Investigation (NA15-2021)

## Prompt

ok, so I want you to investigate something. We have got the election results for national assembly 2021 incorporated in our site. On the candidates page there is vote counts etc, and the constituency page has the candidates results in a table. Yet, what we need to is to mark the status of the candidate in the election, did they win or lose? There is at least one candidate that has status "Not Confirmed" (res-9ef2cc5c79bc), but all the other candidates don't have this. I want you how to investigate this in a new file ai/SCRATCHPAD.md. use ai/SCRATCHPAD.md to keep notes, track what needs to be changed and what has been track, open questions, decisions, and plan in milestones if needed on what to be changed. Remember to ask for my answers to open questions, and also my approval first before moving from one milestone to another.

## Goal
- Determine how to mark candidate election status (win/lose/not confirmed) based on existing data and UI behavior.

## Current Observations
- Results data exists and is shown on candidate + constituency pages.
- There is at least one candidate with status "Not Confirmed" (`res-9ef2cc5c79bc`).
- Other candidates appear to have no explicit status.

## Open Questions (need your answers)
- Should "win/lose" be derived strictly from rank vs seat_count per constituency, or only from explicit status/annotations when available?
- When there are annotations (e.g., not_confirmed), should we still mark as "win" but override with "not confirmed", or show only the annotation status?
- Where should the status show up (candidate page only, constituency table only, both)?
- Do you want status labels in English only or bilingual (EN/VI)?

## Decisions (confirmed)
- Derive win/lose from rank vs `seat_count` per constituency.
- Show annotation status alongside win/lose (see `election_result_candidate_annotation` table).
- Display status on both candidate page and constituency table.
- Labels in English only.
- Compute derived status during JSON export (add `status` to `results.json` records); no DB schema change.

## Plan (Milestones)
1) Milestone 1 — Data audit: identify how to derive win/lose and how annotations are stored in `staging.db` + exported JSON.
2) Milestone 2 — UI mapping: decide display rules and where to surface status.
3) Milestone 3 — Implement + verify.

## Milestone 1 Notes
- Status: in progress (approved).
- `election_result_candidate` has `order_in_unit` for all 866 records (no nulls).
- Constituency seat counts live in `constituency.seat_count` (exported in `public/data/elections/na15-2021/constituencies.json`).
- Example check (`na15-2021-const-12`): `seat_count = 3`, results have `order_in_unit` 1..5.
- Results export includes annotation data:
  - `public/data/elections/na15-2021/results.json` -> `records[].annotations` array.
  - Only annotated record is `res-9ef2cc5c79bc` with `status = not_confirmed`.
- Proposal for derivation (per decisions): `win` if `order_in_unit <= seat_count`; otherwise `lose`. Display annotations alongside.

## Needs to Change (Draft)
- Compute status (win/lose) at render-time using `order_in_unit` + `seat_count` and append annotation badges if present.
- Surfaces: candidate detail page and constituency results table.

## Milestone 2 Details (Draft)
- Candidate detail page (`app/elections/[cycle]/candidates/[entryId]/page.tsx`):
  - Locate results section; add derived status label (Win/Lose) near vote totals.
  - If `annotations` exist on the result record, render an additional “Not confirmed” badge (and optionally expose reason on hover or in small text).
- Constituency page (`app/elections/[cycle]/constituencies/[constituencyId]/page.tsx`):
  - In results table rows, add a Status column (Win/Lose).
  - Append annotation badge(s) in the same cell or adjacent column.
- Derivation rule: `order_in_unit <= seat_count` => Win; otherwise Lose.
- English-only labels.

## Milestone 2 Notes
- Export change needed: add derived `status` to `public/data/elections/na15-2021/results.json` during `data/na15-2021/export-json.py`.
- UI types to update:
  - `ResultsRecord` in `app/elections/[cycle]/candidates/[entryId]/page.tsx`
  - `ResultsRecord` in `app/elections/[cycle]/constituencies/[constituencyId]/page.tsx`
- UI placement: status badge should appear even if there are no annotations (Win/Lose). Annotation badges remain.

## Milestone 2 Status
- Completed: UI mapping confirmed, export+UI touchpoints identified.

## Milestone 3 Notes
- Implemented export changes (`data/na15-2021/export-json.py`) to add `status` based on `order_in_unit` vs `seat_count`.
- UI updates:
  - Candidate page shows Win/Lose badge plus annotation badges.
  - Constituency results table includes a Status column with Win/Lose + annotations.
- Regenerated JSON exports via `python3.11 data/na15-2021/export-json.py` (all `public/data/elections/na15-2021/*.json` touched).
- Update: derived status stored as `won`/`lost` in export for past-tense display.
- Update: add won/lost badge colors via CSS vars for light/dark mode.
