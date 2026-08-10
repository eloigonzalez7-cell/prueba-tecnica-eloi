# Backlog

Thin product backlog for the Podcaster SPA (Inditex frontend challenge).  
Delivery style: **micro-PRs** mapped to steps `S00`–`S37`.

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
| E8 | Cypress e2e + smoke | S33–S35 | Done (`v0.7.0-tests`) |
| E9 | Delivery docs (README, ADRs, traceability) | S36–S37 | Done (`v1.0.0`) |

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

## Definition of Done (per story)

- [x] TypeScript strict, focused diff
- [x] Native CSS only
- [x] Unit tests for touched domain/application logic
- [x] Conventional commit + small PR
- [x] CI green on the PR
- [x] Before a version tag: `npm run changelog` and commit `CHANGELOG.md`
