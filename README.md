# Vietnam Elections Candidate Directory

Static, source-linked directory of official Vietnam election candidates. Built as a Next.js App Router site with a build-time data pipeline (SQLite staging DB -> JSON exports) and deployed to GitHub Pages.

## Goals
- Encyclopedia-mode presentation: no endorsements, rankings, or user submissions.
- Every factual field is backed by a source URL and timestamps.
- Static hosting only; no runtime backend.

## Project Structure
- `app/`: Next.js App Router pages, layouts, and global styles.
- `public/data/`: exported JSON used by the UI at runtime.
- `data/na15-2021/`: raw inputs, staging scripts, and QA checks for NA15-2021.
- `data/staging.db`: SQLite staging database (build artifact).

## Getting Started
```bash
npm install
npm run build
npx serve@latest out
```
Open the URL printed by `serve`.

## Data Pipeline
Build the staging DB, run QA checks, and export JSON:
```bash
npm run data:build
```

Direct scripts (same as above):
```bash
python3 data/na15-2021/build-staging-db.py
python3 data/na15-2021/qa-checks.py
python3 data/na15-2021/export-json.py
```

Exports land in `public/data/elections/na15-2021/`.
Commit `public/data/` outputs before deploying; CI does not rebuild data.

## Development Commands
- `npm run dev`: start the dev server.
- `npm run build`: production build (static export configured).
- `npx serve@latest out`: serve the static export locally.
- `npm run lint`: ESLint.

## Deployment (GitHub Pages)
- Deploys via GitHub Actions to `https://vietthan.github.io/vietnam-elections/`.
- Workflow: `.github/workflows/deploy.yml` runs `next build` and publishes `out/` using committed data artifacts.
- GitHub repo settings: Pages -> Source = GitHub Actions.

## Data Coverage
- MVP cycle: NA15-2021 (15th National Assembly).
- Future cycles: stub routing exists; add datasets as they become available.

## Notes
- All UI copy and data outputs are intended to remain neutral and fully sourced.
- If you add tests, document the framework and add an `npm run test` script.
