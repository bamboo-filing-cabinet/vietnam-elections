# Contact, Questions, Suggestions, Corrections Plan

## Context / repo notes
- Navigation is defined in `app/layout.tsx` (desktop) and `app/mobile-nav.tsx` (mobile).
- Existing policy copy appears in `app/disclaimer/page.tsx`, `app/privacy/page.tsx`, and `app/terms/page.tsx`.
- Current disclaimer text includes "This site does not solicit or publish user submissions." which conflicts with adding a corrections intake.
- Footer links include `Privacy`, `Terms`, `Changelog`, `Bamboo Filing Cabinet`, and `GitHub`, but no contact/corrections link.

## Goal
- Make it unmistakably clear how visitors can contact the project to ask questions, suggest improvements, and report corrections.
- Keep GitHub Issues as the preferred channel (with sources + retrieval dates).
- Provide a Google Form as the anonymous alternative: https://forms.gle/UaPUdJZ5SGrTKdr2A
- Maintain the site's neutral, reference-only stance (no on-site submissions or public comments).
- Ensure all copy is bilingual (EN/VI) wherever the UX surfaces this guidance.

## UX approach (how to present the feature)
- Add a dedicated "Contact & Corrections" surface so visitors do not have to infer where to go.
- Make contact options visible in both high-traffic and policy areas:
  - High-traffic: homepage and footer.
  - Policy: disclaimer + privacy (to avoid contradictions).
- Keep the UI calm and neutral: "report a correction" instead of "submit content."
- Use a single preferred/alternate phrasing everywhere to reduce ambiguity.

## Proposed information architecture
- Add a new page: `/contact` with a clear "Preferred" vs "Anonymous" layout.
  - Suggested sections:
    - "Preferred: GitHub Issues" (link to repo issues, guidelines for sources + retrieval dates)
    - "Anonymous: Google Form" (link to form, note that responses are reviewed manually)
    - "What helps us verify" (examples: source URL, published date, screenshot)
    - Bilingual copy mirroring the English.
- Add a global navigation link to the new page.
  - Desktop nav: near `Disclaimer` or `Sources`.
  - Mobile nav: add alongside `Disclaimer`.
- Add a footer link (lightweight discovery for every page).

## Page-level changes to align copy
- `app/disclaimer/page.tsx`
  - Replace "This site does not solicit or publish user submissions." with bilingual copy that:
    - Invites corrections/questions.
    - Points to GitHub Issues (preferred) and Google Form (anonymous).
- `app/privacy/page.tsx`
  - Adjust "does not accept public submissions" language to clarify:
    - No on-site submissions or accounts.
    - External channels exist (Issues / Form).
- `app/page.tsx`
  - Add a compact card or callout under "What you can do" or "Quick links" linking to contact/corrections.
- `app/methodology/page.tsx` or `app/sources/page.tsx`
  - Optional: add a small "Found an error?" callout to keep the invitation near sourcing context.

## Copy guidelines (consistency)
- Preferred phrasing (EN):
  - "Preferred: GitHub Issues with sources + retrieval dates."
  - "Anonymous option: Google Form."
- Preferred phrasing (VI):
  - "Ưu tiên: GitHub Issues (kèm nguồn + ngày truy xuất)."
  - "Ẩn danh: Google Form."
- Avoid promising public posting; emphasize review and verification.
- Avoid response-time guarantees.
- Keep each callout short; link out for details.

## Phased plan
### Phase 1: Core contact surface
- Add `/contact` page with bilingual sections.
- Add nav + footer link to the new page.
- Ensure desktop and mobile nav parity.

### Phase 2: Align policy copy
- Update disclaimer limitations to remove "no submissions" and replace with the preferred/alternate channels.
- Update privacy policy wording to avoid conflicts with external intake.

### Phase 3: Visibility upgrades
- Add a homepage card or "Quick link" to the new contact page.
- Optional: add a small note in methodology or sources page.

### Phase 4: QA pass
- Verify links on all pages (Issues + Google Form).
- Check for any remaining "no submissions" language.
- Confirm bilingual copy where the contact/corrections guidance appears.

## Decisions
- GitHub Issues remains the primary path; Google Form is for anonymous submissions only.
- No public comments or on-site submission system will be added.
- Contact guidance should appear in both high-traffic UI and policy pages.
- Bilingual copy is required for all contact/corrections surfaces.
- Footer link label: "Contact".

## Open questions
- None.
