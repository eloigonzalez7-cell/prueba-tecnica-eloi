# Podcaster

[![CI](https://github.com/eloigonzalez7-cell/prueba-tecnica-eloi/actions/workflows/ci.yml/badge.svg)](https://github.com/eloigonzalez7-cell/prueba-tecnica-eloi/actions/workflows/ci.yml)

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
| `npm run test:e2e` | Cypress e2e (expects app on `http://localhost:3000`) |
| `npm run cypress:open` | Cypress interactive runner |
| `npm run smoke` | Serve production build + Cypress against `:4173` |
| `npm run lint` | ESLint (`src/**/*.{ts,tsx}`) |
| `npm run changelog` | Regenerate `CHANGELOG.md` with local git-cliff |

### E2E tips

```bash
# Dev e2e (two terminals)
npm start
npm run test:e2e

# Production smoke (build + preview + Cypress)
npm run build
npm run smoke
```

Specs intercept iTunes traffic (dev proxy or AllOrigins) with fixtures under `cypress/fixtures/`.

## Features

- **Home** `/` — top 100 podcasts, live filter by title/author, count badge, 24h `localStorage` cache
- **Podcast** `/podcast/:podcastId` — sidebar + episodes table, 24h cache; empty lookup description enriched from top-feed summary
- **Episode** `/podcast/:podcastId/episode/:episodeId` — DOMPurify-sanitized HTML description + `<audio controls>`
- **Chrome** — “Podcaster” header link → home; top-right loading spinner while fetching
- Clean URLs (React Router, no hash routing)
- Semantic HTML + CSS Modules (native CSS only)

## Architecture

Feature-oriented **hexagonal** layout:

```text
src/
  app/                 # shell, router, loading context
  shared/              # http, html sanitize, global tokens
  features/podcasts/
    domain/            # Podcast, Episode, ports (no React / no fetch)
    application/       # use cases (GetTopPodcasts, FilterPodcasts, GetPodcastDetail)
    infrastructure/    # iTunes adapters, cache decorator, mappers
    ui/                # React pages + composition root (podcastDependencies)
```

Rules of thumb:

- UI never knows iTunes or AllOrigins URLs.
- Domain has no React/fetch.
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
| CI | GitHub Actions (`lint` / `test` / `build` / `e2e-smoke` / changelog check) |

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

`v0.0.0-init` → `v0.1.0-foundation` → `v0.2.0-domain` → `v0.2.1-data` → `v0.3.0-home` → `v0.4.0-detail` → `v0.5.0-episode` → `v0.6.0-chrome` → `v0.7.0-tests` → `v1.0.0`

## License

Private technical challenge submission. Not licensed for redistribution.
