# Backlog

Thin product backlog for the Podcaster SPA (Inditex frontend challenge).  
Delivery style: **micro-PRs** mapped to steps `S00`–`S41`.

## Status legend

- Done — merged to `main`
- In progress — current slice
- Next — upcoming work
- Later — after core flows

## Epics

| ID | Epic | Steps | Status |
|----|------|-------|--------|
| E0 | Foundation (Webpack, TS, React shell, router, CI) | S00–S10 | Done (`v0.1.0-foundation`) |
| E1 | Planning + changelog (backlog, estimations, git-cliff) | S11 + changelog | Done |
| E1b | ADRs (webpack, hexagonal, cache, testing) | S12–S13 / S37 | Done |
| E2 | Domain + cache ports | S14–S17 | Done (`v0.2.0-domain`) |
| E3 | iTunes infrastructure | S18–S22 | Done (`v0.2.1-data`) |
| E4 | Home (top 100 + live filter) | S23–S25 | Done (`v0.3.0-home`) |
| E5 | Podcast detail | S26–S28 | Done (`v0.4.0-detail`) |
| E6 | Episode detail + safe HTML | S29–S30 | Done (`v0.5.0-episode`) |
| E7 | App chrome (header + nav loading) | S31–S32 | Done (`v0.6.0-chrome`) |
| E8 | Cypress e2e + smoke | S33–S35 | Done (`v0.7.0-tests`; suite expanded on `v1.1.0` / `v1.2.0`) |
| E9 | Delivery docs (README, ADRs, traceability) | S36–S37 | Done (`v1.0.0`; milestones through `v1.2.2`) |
| E10 | GFT review: reliable Cypress e2e | S38 | Next (`v1.2.4`) |
| E11 | GFT review: detail loading until data settles | S39 | Next (`v1.2.5`) |
| E12 | GFT review NTH: paginated + virtualized home list | S40–S41 | Later (`v1.3.0` / `v1.3.1`) |

Current delivery tag: **`v1.2.3`** (GFT review backlog). Next: `v1.2.4` (E10) → `v1.2.5` (E11) → `v1.3.0` / `v1.3.1` (E12).

## GFT technical review (2026-08)

Source: Inditex/GFT reviewer via Luis Miguel Merino. Base submission was accepted; these slices make the demo client-ready.

| Step | Slice | Target tag |
|------|-------|------------|
| S38 | Reproduce and fix 2 failing e2e specs; assert detail skeleton vs premature `Podcast not found` | `v1.2.4` |
| S39 | Keep detail/episode skeleton until load settles (abort/`finally` race + Suspense fallback); never flash `not found` on a cold cache | `v1.2.5` |
| S40 | Application-layer pagination: page size 10/25/50/100 + pager; `PagedResult` over the cached top 100 (iTunes RSS is a single feed) | `v1.3.0` |
| S41 | Virtualize the home grid for the current page so page size 100 does not mount 100 image cards | `v1.3.1` |

## Brief requirements → epic mapping

| Requirement | Epic |
|-------------|------|
| SPA, clean URLs (no hash) | E0 |
| Dev unminified / prod minified | E0 |
| Top 100 podcasts + 24h client cache | E2, E3, E4 |
| Live filter by title/author | E2, E4 |
| Podcast detail + episode list + 24h cache | E2, E3, E5 |
| Episode detail + HTML description + audio | E6 |
| Header link home + top-right loading on navigation | E7 |
| Public repo + README + progressive tags | E0, E1, E9 |
| Changelog from Conventional Commits + tags | E1 |
| Stable e2e (GFT review) | E10 |
| Detail skeleton until cache/network resolves (GFT review) | E11 |
| NTH: list pagination + page size (GFT review) | E12 |
| Virtualized home grid (page size 100) | E12 |

## Definition of Done (per story)

- [x] TypeScript strict, focused diff
- [x] Native CSS only
- [x] Unit tests for touched domain/application logic
- [x] Conventional commit + small PR
- [x] CI green on the PR
- [x] Before a version tag: update `CHANGELOG.md` **and** README (`Current release`, Features, Milestone tags) + REQUIREMENTS/BACKLOG delivery notes; commit with `chore(release): …`
