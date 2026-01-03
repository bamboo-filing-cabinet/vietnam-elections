# Repository Guidelines

## Project Structure & Module Organization

- `app/` holds the Next.js App Router source (routes, layouts, and global styles). Example: `app/page.tsx` is the home page, `app/layout.tsx` defines the shared layout.
- `public/` contains static assets served at the site root (e.g., `public/logo.svg` -> `/logo.svg`).
- Root config files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`) define build, TypeScript, and linting behavior.

## Build, Test, and Development Commands

- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create the production build (`.next/` output).
- `npm run start`: run the production server from the build output.
- `npm run lint`: run ESLint with the Next.js + TypeScript config.

## Coding Style & Naming Conventions

- Language: TypeScript + React (Next.js App Router).
- Formatting: follow existing file style; use 2-space indentation in JSON/configs and standard TS/TSX conventions.
- Naming: components in `PascalCase`, hooks in `useThing` format, files in `kebab-case` or `lowercase` (match nearby files).
- Styles: Tailwind CSS is enabled (`@import "tailwindcss";` in `app/globals.css`). Prefer Tailwind utilities over ad-hoc CSS unless adding global theme tokens.

## Testing Guidelines

- No test framework is configured yet. If you add tests, document the framework and add a corresponding `npm run test` script.
- Until tests exist, validate changes by running `npm run lint` and checking the dev server.

## Commit & Pull Request Guidelines

- Git history is minimal and does not establish a convention. Use clear, imperative commit messages (e.g., `Add district filter UI`).
- Pull requests should include: a short summary, what changed, and UI screenshots or GIFs when visuals change.
- Link related issues or tickets when applicable.

## Configuration & Environment

- Add secrets to a local `.env.local` (if needed) and avoid committing it.
- Keep `next.config.ts` and `tsconfig.json` changes scoped and documented in the PR description.
