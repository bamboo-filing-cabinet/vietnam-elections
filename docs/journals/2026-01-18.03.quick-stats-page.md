# Quick Stats Page Planning (NA15-2021)

Purpose: plan a stats-focused page that visualizes and summarizes the metrics in `ai/2026-01-18.02.quick-stats.md`, with room to add future infographics.

## Page Goals
- Present key stats fast (scanable, neutral, sourced).
- Provide optional drill-down and methodology notes.
- Design for future charts/infographics without reworking layout.

## Proposed Page Structure
1) Hero + headline numbers
   - Total candidates, winners, constituencies, localities.
   - Small “source: local data” note.

2) Distribution blocks (small multiples)
   - Candidates per constituency (range + histogram bucket counts).
   - Seats per locality (distribution excluding top 5).
   - Age distribution (avg/median + youngest/oldest winners).

3) Top/Bottom lists (ranked but neutral framing)
   - Highest votes, highest vote %, lowest winner vote %.
   - Largest/smallest winner–loser gaps (votes and %).
   - Localities with most/least candidates and seats.

4) Demographics
   - Ethnicity: Kinh vs non-Kinh + top counts.
   - Religion: counts + % (note data normalization caveat).
   - Gender split.

5) Education
   - General education distribution.
   - Political theory distribution.
   - Academic rank mentions + grouped values.

6) Irregularities / annotations
   - Not-confirmed candidate.
   - Constituency mismatch list (swap note for Quảng Bình units).

7) Methodology / data notes (collapsible)
   - Data sources (staging.db / results.json).
   - How “winner/loser gap” is computed.
   - Handling of missing or folded values.

## Visual/UX Ideas (future-friendly)
- KPI cards for headline stats.
- “Small multiple” chart row for distributions (bar or dot plots).
- Ranked list cards with mini bars (for votes, % gaps).
- Sticky side nav for sections (desktop) + accordion on mobile.
- Neutral palette with subtle data accents; typography emphasis for numbers.

## Open Questions
- Top KPIs: total candidates, total winners, constituencies, localities, avg candidates per constituency, avg age (candidates vs winners).
- Comparison format: side-by-side candidate vs winner panels; stack on mobile.
- Charts: plain SVG with simple labels.

## Decisions (Locked In)
- KPIs: total candidates, total winners, constituencies, localities, avg candidates/constituency, avg age (candidates vs winners).
- Comparison: side-by-side panels on desktop, stacked on mobile.
- Charts: plain SVG with simple labels.
- Data source: hard-coded stats from `ai/2026-01-18.02.quick-stats.md` (no runtime computation).

## Milestones / Progress
1) Content map + KPI definitions (completed)
2) Layout wireframe + responsive section order (completed)
3) Component plan for SVG charts + list cards (completed)
4) Page implementation + data wiring (completed)
5) Review pass (neutrality, labeling, footnotes) (completed)

## Milestone 1: Content Map + KPI Definitions
### KPI Cards (top row)
- Total candidates: 868 (roster).
- Total winners: 500 (results status=won).
- Constituencies: 186.
- Localities: 63.
- Avg candidates/constituency: 4.72.
- Avg age: candidates 45.47; winners 49.28 (as of 2021-05-23).

### Section Content Map
1) Headline KPIs
   - KPI cards above.
   - Source note: local data only.

2) Distributions
   - Candidates per constituency (min/max + histogram buckets).
   - Seats per locality (distribution excluding top 5 seat localities).
   - Age summary (avg/median + oldest/youngest winners).

3) Top/Bottom Lists
   - Highest votes (top 5).
   - Highest vote % (top 5).
   - Bottom winners by votes and by %.
   - Largest/smallest winner–loser gaps (votes and %).
   - Localities with most/least candidates.
   - Localities with most/least seats (note 12-seat tie and 6-seat floor).

4) Demographics
   - Gender split.
   - Ethnicity: Kinh vs non-Kinh + full counts list.
   - Religion: counts + % (note normalization caveat).

5) Education
   - General education distribution.
   - Political theory distribution.
   - Academic rank mentions + grouped (value_folded) counts.

6) Irregularities
   - Not-confirmed candidate (Bình Dương unit 1).
   - Constituency mismatch list (incl. Quảng Bình unit swap note).

7) Methodology
   - Sources: staging.db + results.json.
   - Winner/loser gap definition.
   - Handling of missing/folded values.

## Milestone 2: Layout Wireframe + Responsive Order
### Desktop (wide)
1) Header block\n   - Title, short blurb, source note.
2) KPI grid (3x2)\n   - 6 KPI cards.
3) Distribution row (3 columns)\n   - Candidates/constituency\n   - Seats/locality (excl. top 5)\n   - Age summary (avg/median + callouts).
4) Top/Bottom lists (2 columns)\n   - Left: top votes + top vote %\n   - Right: bottom winners + gaps.
5) Localities focus (2 columns)\n   - Most/least candidates\n   - Most/least seats + seat distribution note.
6) Demographics (3 columns)\n   - Gender split\n   - Ethnicity (Kinh vs non-Kinh + link to full list)\n   - Religion (counts + % + caveat).
7) Education (3 columns)\n   - General education\n   - Political theory\n   - Academic rank.
8) Irregularities (full width)\n   - Not-confirmed candidate + constituency mismatch list.\n9) Methodology (full width, collapsible)\n   - Definitions + sources.

### Mobile (stacked)
1) Header\n2) KPI cards (2-column grid)\n3) Distributions (stacked)\n4) Top/Bottom lists (stacked sections)\n5) Localities focus\n6) Demographics\n7) Education\n8) Irregularities\n9) Methodology (accordion)

### Notes
- Use consistent section headers + small subheaders for list types.\n- Allow long lists to collapse/expand on mobile.\n- Keep all sections optional for future chart inserts (SVG placeholder boxes).

## Milestone 3: Component Plan (SVG + List Cards)
### Reusable Components
- KPIStatCard\n  - Props: label, value, sublabel (optional), footnote (optional).\n  - Use large numeric typography + small muted label.

- MiniBarChart (SVG)\n  - Props: data[{label, value}], maxValue, unit.\n  - Usage: candidates/constituency buckets; seats/locality buckets.\n  - Minimal axis: left labels + right values.

- DotPlot (SVG)\n  - Props: min, max, markers[{label, value}].\n  - Usage: age summary or vote-gap distribution (optional).

- RankedListCard\n  - Props: title, items[{label, value, context}].\n  - Optional mini bars scaled to max in list.

- SplitPanel (side-by-side)\n  - Props: leftTitle/rightTitle, leftItems/rightItems.\n  - Collapses to stacked panels on mobile.

- CollapsibleNote\n  - Props: title, children. Used for Methodology, long lists, caveats.

### Data Formatting Rules
- Thousands separators for votes; 2 decimals for %.\n- “pp” suffix for percentage point gaps.\n- Ages as integer years.

### Accessibility / Neutrality
- Avoid “winner/loser” badges; use “results: won/lost” labels.\n- Ensure SVGs have aria-label or fallback text.\n- Keep neutral phrasing (“largest observed gap”).

## Milestone 4: Page Implementation + Data Wiring
- Added `app/elections/[cycle]/quick-stats/page.tsx` with NA15 hard-coded stats.
- Added Quick stats link to `app/elections/[cycle]/page.tsx` Explore grid.
- NA16 route renders a “coming soon” message.

## Milestone 5: Review Pass
- Added neutral framing note and softened labels (e.g., “won/lost gaps”).
