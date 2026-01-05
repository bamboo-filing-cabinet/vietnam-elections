
# Audit: Data fields not shown

## Initial Prompt
do an audit of data that is currently not being show on the site, some fields may not need to be shown. use ai/SCRATCHPAD.md to keep notes, track what needs to be changed and what has been track, open questions, decisions, and plan in milestones if needed on what to be changed. Remember to ask for my approval first before moving from one milestone to another.

## Goal
- Identify data fields present in exported JSON that are not rendered in the UI.

## Milestones
1) Audit data exports vs UI surfaces.
2) Recommend what to add/omit with rationale.
3) Implement approved changes.

## Status
- Milestone 1 complete. Milestone 2 complete. Milestone 3 complete.

## Findings (audit)
- `public/data/elections/na15-2021/timeline.json`: `cycle.type`, `start_date`, `end_date`, `notes` not displayed.
- `public/data/elections/na15-2021/documents.json`: only `title`, `url`, `fetched_date` shown; unused: `doc_type`, `file_path`, `published_date`, `notes`, plus `cycle_id`, `generated_at`.
- `public/data/elections/na15-2021/changelog.json`: not used; UI has placeholder `app/changelog/page.tsx`.
- `public/data/elections/na15-2021/localities.json`: `type` not displayed.
- `public/data/elections/na15-2021/constituencies.json`: `description` used for search only; `unit_context_raw` unused; `name_folded` unused.
- `public/data/elections/na15-2021/candidates_index.json`: `unit_number` unused in UI (sort/filter uses locality/constituency/list order only).
- `public/data/elections/na15-2021/candidates_detail/*.json`:
  - `entry`: `party_member_since`, `is_na_delegate`, `is_council_delegate` not displayed.
  - `person`: `id`, `full_name_folded` not displayed.
  - `locality.type` unused.
  - `constituency.description`, `unit_context_raw` unused on candidate page.
  - `sources`: `doc_type`, `published_date`, `notes`, `document_id` not displayed (title/url/fetched_date/fields shown).
  - `changelog` not displayed.

## Open questions
- Should we surface any of the unused fields, or keep them hidden (e.g., party membership, delegate flags)?
- Should changelog be wired into `/changelog` or candidate pages once data exists?

## Decisions
- None yet.

## Milestone 2 notes (recommendations)
- Timeline: show `start_date`, `end_date` (when present), and `notes` with source context.
- Documents: display `doc_type`, `published_date`, `notes` for provenance; keep `file_path` hidden (internal).
- Candidate detail: surface `party_member_since`, `is_na_delegate`, `is_council_delegate` in a small “Political background” block.
- Constituencies: `unit_context_raw` is verbose; keep hidden or add an expandable “Source excerpt” if needed.
- Localities: `type` likely not needed in UI.
- Candidates index: `unit_number` could be shown near constituency label for quick scanning.
- Sources: add `doc_type` + `published_date` + `notes` in the source list; keep `document_id` hidden.
- Changelog: keep placeholder until real data exists; consider showing candidate `changelog` entries if populated.

## Decision (timeline handling)
- Use `data/manual/timelines.json` keyed by cycle; load into `staging.db` during `build-staging-db.py`.

## Decision (na15-2021 timeline dates)
- `start_date`: 2021-05-23 (election day, Wikipedia: https://en.wikipedia.org/wiki/2021_Vietnamese_legislative_election)
- `notes`: include first sitting date 2021-07-20 (Wikidata: https://www.wikidata.org/wiki/Q107979136)

## Implementation status
- Added `data/manual/timelines.json` and load it in `data/na15-2021/build-staging-db.py` so `staging.db` carries dates.
- Implemented timeline details, document metadata, political background, source metadata, candidate unit numbers, and candidate changelog (conditional).
