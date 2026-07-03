# Scratchpad: Persisting result status in staging DB

## Goal
Keep `election_result_candidate_annotation` as the canonical status source and update exports to surface multiple statuses cleanly while preserving provenance.

## Context
- Current export computes `status` in `data/na15-2021/export-json.py` from `order_in_unit` vs `seat_count`.
- Annotations already exist in `election_result_candidate_annotation` with `status`, `reason`, `effective_date`, etc., but they do not drive the exported `status`.

## Proposed approach
### Milestone 1: Data model decisions
- Keep `election_result_candidate_annotation` as canonical for result statuses.
- Export both:
  - `statuses`: array of status codes derived from annotations (distinct, ordered).
- Define and document the status vocabulary (e.g., `won`, `lost`, `not_confirmed`, `ineligible`).
- Drop the single `status` field to avoid implying a canonical precedence.

### Milestone 2: Annotation ordering + semantics
- Decide how to order statuses when multiple annotations exist:
  - Primary rule: order by `effective_date` (oldest → newest), fallback to insertion order or ID.
  - Distinct-ify for `statuses` while preserving order.
- Confirm whether annotations can be concurrent; if yes, ensure `statuses` includes all active statuses.

### Milestone 3: Export changes
- Update `data/na15-2021/export-json.py`:
  - Build `statuses` from annotations.
  - Remove `status` from exported records.
  - Keep existing annotations export intact for provenance.
- Do not fallback to derived `won/lost` when annotations are missing.

### Milestone 4: QA checks
- Extend `data/na15-2021/qa-checks.py` to validate:
  - All annotated statuses are in the allowed vocabulary.
  - If annotations exist, `statuses` is non-empty and includes the expected canonical statuses.
  - If no annotations exist, fallback logic is consistent (if allowed).

### Milestone 5: Docs + consumers
- Update `README.md` and `data/na15-2021/README.md` with:
  - New `statuses` field semantics.
  - Removal of `status` in favor of `statuses`.
- Update UI usage if it relies on `status` only; consider switching to `statuses` for display.

## Open questions
- Status vocabulary confirmed for now: `won`, `lost`, `not_confirmed`. Keep extensible for future additions.
