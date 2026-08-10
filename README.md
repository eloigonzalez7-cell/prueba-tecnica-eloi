# Podcaster

[![CI](https://github.com/eloigonzalez7-cell/prueba-tecnica-eloi/actions/workflows/ci.yml/badge.svg)](https://github.com/eloigonzalez7-cell/prueba-tecnica-eloi/actions/workflows/ci.yml)

**Current release:** [`v1.2.0`](https://github.com/eloigonzalez7-cell/prueba-tecnica-eloi/releases/tag/v1.2.0) — see [CHANGELOG.md](CHANGELOG.md).

Single-page application to browse Apple’s top music podcasts, open podcast details, and play episodes. Built for the **Inditex frontend technical challenge**.

## Requirements

- **Node.js** `>= 22`
- **npm** `>= 10`
- Latest **Google Chrome** (desktop) — review target

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Production mode

```bash
npm run build
npm run preview
```

- **Development** (`npm start`): Webpack serves assets **without** minification (port `3000`, history API fallback, `/itunes-proxy` → iTunes).
- **Production** (`npm run build`): assets are **concatenated and minified** under `dist/`. Preview serves SPA on port `4173`. Prod CORS uses **AllOrigins**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on port 3000 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist/` on port 4173 |
| `npm test` | Unit tests (Jest) |
| `npm run test:watch` | Jest watch mode |
| `npm run test:e2e` | Cypress e2e suite against dev (`http://localhost:3000`) |
| `npm run cypress:open` | Cypress interactive runner (best for exploring specs) |
| `npm run smoke` | Same Cypress suite against production preview (`:4173`) |
| `npm run lint` | ESLint (`src/**/*.{ts,tsx}`) |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm run changelog` | Regenerate `CHANGELOG.md` with local git-cliff |

### E2E tips

Cypress is the **full e2e suite** under `cypress/e2e/` (home filter/error, navigation chrome, podcast/episode flow, 24h cache).  
`npm run smoke` is not a different kind of test: it rebuilds/serves `dist/` and runs **the same Cypress specs** against production (`AllOrigins` URLs still match the intercepts).

```bash
# Dev e2e (two terminals)
npm start
npm run test:e2e
# or interactively:
npm run cypress:open

# Production smoke (build + preview + same Cypress suite)
npm run build
npm run smoke
```

Specs use custom commands (`cy.stubItunesApis`) and fixtures under `cypress/fixtures/` so CI never depends on live Apple/AllOrigins.

## Features

- **Home** `/` — top 100 podcasts, live filter by title/author, count badge, 24h `localStorage` cache
- **Podcast** `/podcast/:podcastId` — sidebar + episodes table, 24h cache; empty lookup description enriched from top-feed summary (enriched snapshot written back to cache)
- **Episode** `/podcast/:podcastId/episode/:episodeId` — DOMPurify-sanitized HTML, bare `https://` / `domain/path` URLs linkified, newlines preserved, plus `<audio controls>` (lookup `limit=20` matches the brief sample URL)
- **Chrome** — “Podcaster” header link → home; top-right loading spinner while fetching
- Route-level **code splitting** (`React.lazy`) for the three pages
- Visible **error + Retry** on failed loads (also logged to the console)
- Clean URLs (React Router, no hash routing)
- Semantic HTML + CSS Modules (native CSS only)
- **Cypress e2e** — structured suite (`home`, `navigation`, `podcast-flow`, `cache`) with custom commands; `smoke` re-runs the same suite against prod

## Architecture

Feature-oriented **hexagonal** layout:

```text
src/
  app/                 # shell, router, loading context, composition root
  shared/              # http, html sanitize, global tokens
  features/podcasts/
    domain/            # Podcast, Episode, ports (no React / no fetch)
    application/       # use cases (GetTopPodcasts, FilterPodcasts, GetPodcastDetail)
    infrastructure/    # iTunes adapters, cache decorator, mappers
    ui/                # React pages and presentational components
```

Rules of thumb:

- UI never knows iTunes or AllOrigins URLs.
- Domain has no React/fetch.
- Composition root lives in `src/app/podcastDependencies.ts`.
- Path alias: `@/*` → `src/*` (TypeScript, Webpack, Jest).

## Stack

| Area | Choice |
|------|--------|
| UI | React 19, React Router 7 |
| Language | TypeScript (strict) |
| Bundler | Webpack 5 (dev unminified / prod minified) |
| Styles | Native CSS + CSS Modules |
| Unit tests | Jest + Testing Library |
| E2E | Cypress |
| HTML safety | DOMPurify |
| CI | GitHub Actions (`typecheck` / `lint` / `test` / `build` / `e2e-smoke` / changelog check) |

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/BACKLOG.md](docs/BACKLOG.md) | Epic backlog (S00–S37) |
| [docs/ESTIMATIONS.md](docs/ESTIMATIONS.md) | Effort notes |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Requirements ↔ epic traceability |
| [docs/adr/0001-webpack.md](docs/adr/0001-webpack.md) | ADR: Webpack 5 |
| [docs/adr/0002-hexagonal.md](docs/adr/0002-hexagonal.md) | ADR: hexagonal feature modules |
| [docs/adr/0003-caching.md](docs/adr/0003-caching.md) | ADR: 24h localStorage cache |
| [docs/adr/0004-testing-strategy.md](docs/adr/0004-testing-strategy.md) | ADR: Jest + Cypress |
| [CHANGELOG.md](CHANGELOG.md) | Generated from Conventional Commits + tags |

## Milestone tags

`v0.0.0-init` → `v0.1.0-foundation` → `v0.2.0-domain` → `v0.2.1-data` → `v0.3.0-home` → `v0.4.0-detail` → `v0.5.0-episode` → `v0.6.0-chrome` → `v0.7.0-tests` → `v1.0.0` → `v1.1.0` → `v1.2.0`

### Release checklist

Before tagging a new version, update **all** of:

1. `CHANGELOG.md` (git-cliff / Conventional Commits)
2. **This README** — `Current release`, Features (if behaviour changed), Milestone tags
3. `docs/REQUIREMENTS.md` + `docs/BACKLOG.md` delivery tag notes
4. Commit with `chore(release): sync changelog for vX.Y.Z` (skipped by git-cliff), then tag `vX.Y.Z`

## License

Private technical challenge submission. Not licensed for redistribution.
