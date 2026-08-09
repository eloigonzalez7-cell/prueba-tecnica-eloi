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
| E0 | Foundation (Webpack, TS, React shell, router, CI) | S00–S10 | Done |
| E1 | Planning + changelog (backlog, estimations, git-cliff) | S11 + changelog | In progress |
| E1b | ADRs (webpack, hexagonal) | S12–S13 | Next |
| E2 | Domain + cache ports | S14–S17 | Later |
| E3 | iTunes infrastructure | S18–S22 | Later |
| E4 | Home (top 100 + live filter) | S23–S25 | Later |
| E5 | Podcast detail | S26–S28 | Later |
| E6 | Episode detail + safe HTML | S29–S30 | Later |
| E7 | App chrome (header + nav loading) | S31–S32 | Later |
| E8 | Cypress e2e + smoke | S33–S35 | Later |
| E9 | Delivery docs (README, ADRs, traceability) | S36–S37 | Later |

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

- [ ] TypeScript strict, focused diff
- [ ] Native CSS only
- [ ] Unit tests for touched domain/application logic
- [ ] Conventional commit + small PR
- [ ] CI green on the PR
- [ ] Before a version tag: `npm run changelog` and commit `CHANGELOG.md`
