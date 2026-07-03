# Visual Style Plan

## Goal
Move away from default black/white Next.js look with a bold, distinctive visual direction that fits the Vietnam elections data story.

## Milestones
1) Direction + moodboard (textual) + palette
2) Typography system + layout rhythm
3) Components + data-viz styling (cards, tables, charts)
4) Motion + backgrounds
5) Polish + consistency sweep

## Milestone 1: Direction + palette (proposed)
- Themes to explore:
  - Civic Modernism: clean grid, strong geometric shapes, bold accent colors
  - Archival Print: paper texture, muted inks, serif headlines
  - Contemporary Editorial: oversized typography, bright accents, high-contrast sections
- Direction recommendation (Vietnam-related, not overtly political):
  - Contemporary Editorial + subtle archival cues.
  - Rationale: energetic but credible; supports data storytelling; avoids propaganda vibe.
- Palette options (avoid “all red”):
  - Option A (Editorial Civic):
    - Primary: Deep red (used sparingly for emphasis)
    - Secondary: Indigo/navy
    - Accent: Warm saffron/gold
    - Neutrals: Off‑white, charcoal
  - Option B (Archival Ink):
    - Primary: Brick red
    - Secondary: Forest green
    - Accent: Aged gold
    - Neutrals: Paper beige, ink black
  - Option C (Modern Signal):
    - Primary: Vermilion
    - Secondary: Teal
    - Accent: Mango
    - Neutrals: Warm gray, near‑black
- Suggested pick: Option A (feels Vietnam-adjacent without leaning on overt symbols).

## Milestone 2: Typography system
- Typeface direction (Vietnam Flag theme):
  - Headline: a strong geometric or slab-like serif for civic weight.
  - Body: a clean humanist sans for readability.
  - Numerals: tabular/lining for data tables.
- Suggested pairings (pick 1):
  - Pairing A: Source Serif 4 (head) + Source Sans 3 (body) + tabular numbers
  - Pairing B: IBM Plex Serif (head) + IBM Plex Sans (body)
  - Pairing C: Literata (head) + Work Sans (body)
- Chosen pairing: Pairing D (System Default)
- Type scale (example):
  - Hero: 56/60
  - H1: 40/48
  - H2: 28/36
  - H3: 22/30
  - Body: 16/26
  - Caption: 12/18
- Layout rhythm:
  - 8px spacing grid, larger section gaps (48-64px).
  - Strong section headers with underlines or color blocks in flag colors.

## Milestone 3: Components + data-viz
- Card system:
  - High-contrast card headers (red bar + yellow underline).
  - Numeric highlights in red, secondary stats in darker red.
- Tables:
  - Zebra rows using pale yellow tint.
  - Header row in deep red with white text; sticky headers on long tables.
- Charts:
  - Primary series: flag red.
  - Secondary series: deep red.
  - Accent series: flag yellow (sparingly, avoid glare).
  - Background gridlines: light beige for subtlety.
- UI components:
  - Badges/filters: red outline, yellow fill for active.
  - Buttons: red primary, yellow hover accent; outline variant in dark red.

## Milestone 4: Motion + backgrounds
- Motion:
  - Page-load reveal: 200ms fade + 8px rise.
  - Section stagger: 80ms delay between blocks.
  - Hover emphasis: subtle underline slide on links.
- Backgrounds:
  - Soft paper texture effect via light noise overlay.
  - Angular red/yellow diagonal blocks in hero/footer.
  - Avoid heavy gradients; keep palette bold and flat.

## Milestone 5: Polish
- Ensure spacing consistency with 8px grid; tighten typographic hierarchy.
- Contrast checks for red/yellow on light backgrounds.
- Responsive checks on small screens (nav, tables, charts).
- Consistency sweep for buttons, badges, and card headers.

---

# Implementation Plan (Site Update)

## Implementation Milestones
1) Global theme tokens + layout base
2) Navigation + hero sections
3) Cards, tables, filters, list items
4) Motion + background accents
5) Final sweep + contrast check

## Implementation Progress
- Milestone 1: completed (tokens + base layout colors).
- Milestone 2: completed (header/footer, theme toggle, key hero sections).
- Milestone 3: completed (cards, filters, list items, detail pages).
- Milestone 4: completed (stagger motion + background accents).
- Milestone 5: completed (focus states + contrast polish).

## Milestone 3.1: Readability fixes (requested)
- CycleNav active tab contrast fix (selected text vs background).
- Dark mode header readability (raise contrast in hero headers).
## Milestone 3.1 Progress
- Completed CycleNav active tab contrast adjustment.
- Tweaked dark mode label color for better header contrast.
## Milestone 3.1 Update
- Adjusted active CycleNav pill to yellow background with red text for higher contrast.
- Shifted dark label color to a warmer orange to avoid pink.
- Reverted CycleNav active pill to red background with yellow text and added a yellow ring for clarity.

## Milestone 1: Global theme tokens + layout base
- Define CSS variables for Vietnam flag palette in `app/globals.css`.
- Update body/background to warm paper + flag accents.
- Normalize default text colors + link styles.
- Introduce utility classes for card headers and section labels.
## Decisions
- Intensity: Bold.

## Milestone 2: Navigation + hero sections
- Update header/footer colors to match red/yellow theme.
- Refresh site title badge (VE) to flag red with yellow accent.
- Adjust hero sections on key pages for stronger visual hierarchy.
## Notes
- Theme toggle requested in header with persistence (light/dark).

## Milestone 3: Cards, tables, filters, list items
- Replace zinc palette classes with new theme colors across pages.
- Define consistent card styles (borders, shadows, headers).
- Re-style tables (header row, zebra, hover).
- Update filter/search inputs and badges.

## Milestone 4: Motion + background accents
- Add subtle motion utilities (fade-rise, stagger).
- Add diagonal color block or banding in global layout background.
- Keep motion minimal for readability.

## Milestone 5: Final sweep + contrast check
- Revisit each page for color consistency + spacing.
- Contrast check for red/yellow on light backgrounds.
- Mobile nav polish and focus states.

## Notes
- Ask for approval before moving from one implementation milestone to the next.

## Open Questions
- Are there reference sites or visual inspirations you like?
- Any must-use colors or themes tied to Vietnam elections branding?

## Notes
- Ask for approval before moving from one milestone to the next.
- User input: no reference sites; wants Vietnam-related feel; red is a candidate but avoid heavy communist vibe; also wants it to be less boring.
- User preference update: likes Cool Editorial (Option F) but wants jade accent.
- User preference update: likes Vietnam Flag theme (Option J).
