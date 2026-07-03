# Investigation: Sources per election

## Goal
- Evaluate moving "Sources" from top-level navigation to per-election documents/sources views.

## Current findings
- Top-level Sources page: `app/sources/page.tsx` reads `public/data/elections/na15-2021/documents.json` and renders a single NA15 list.
- Global navigation links to `/sources` in `app/layout.tsx` and `app/mobile-nav.tsx`.
- Candidate detail pages already show per-entry sources: `app/elections/[cycle]/candidates/[entryId]/page.tsx`.
- Election overview page (`app/elections/[cycle]/page.tsx`) has a placeholder card: "Documents and timeline pages will appear here."
- Cycle nav (`app/elections/[cycle]/CycleNav.tsx`) only switches cycles.

## Open questions
- None.

## Decisions
- Use `/elections/[cycle]/sources` for per-election sources (sources > documents).
- Keep `/sources` for cross-election, generic sources; add note that election-specific sources live on each election page.
- Add a dedicated per-election sources page and link from election overview (placeholder).

## Milestones
1) Scope & UX plan: confirm desired URL/behavior for sources and nav changes.
2) Implementation: add per-election sources page, surface link from election overview/nav, adjust global nav.
3) Cleanup: update any copy/links and ensure old `/sources` behavior matches decision.

## Change log
- 2026-01-04: Logged initial repo findings.
- 2026-01-04: Recorded decisions from user.
- 2026-01-04: Implemented per-election sources page, updated election overview link, and refocused `/sources` on cross-election content.
