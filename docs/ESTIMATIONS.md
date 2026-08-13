# Estimations

Story points use Fibonacci. **1 SP ≈ 1–1.5 focused hours** (including review/PR friction).

## Epic totals

| Epic | SP | Notes |
|------|----|--------|
| E0 Foundation | 8 | Done via micro-PRs S00–S10 |
| E1 Planning + changelog | 2 | Backlog, estimations, git-cliff + CI |
| E1b ADRs | 1 | Webpack + hexagonal decision records |
| E2 Domain + cache | 5 | Models, ports, TTL cache, filter use case |
| E3 iTunes infra | 8 | HTTP, AllOrigins, mappers, repos |
| E4 Home UI | 5 | Grid + live filter |
| E5 Podcast detail | 5 | Sidebar + episodes table |
| E6 Episode | 5 | Sanitized HTML + audio |
| E7 Chrome | 3 | Header + loading indicator |
| E8 E2E | 5 | Cypress + prod smoke |
| E9 Delivery docs | 3 | README + remaining ADRs |
| **P0 total** | **~50** | Roughly 4–7 focused days |
| E10 GFT e2e | 2 | Reproduce 2 failing Cypress specs; skeleton assertion |
| E11 GFT detail loading | 3 | Abort/`finally` race, Suspense fallback, RTL + e2e |
| E12 Pagination + virtualization | 8 | `PagedResult` + page size UI + windowed grid |
| **Review-response total** | **13** | `v1.2.3`–`v1.3.1` |

## Why these numbers

- **E3 is highest** — CORS proxy, payload shape variance, cache decorator.
- **E0 looked large but was split** into ~10 PRs so each review stayed small.
- **UI epics stay mid-size** because domain/infra land first; pages mostly compose use cases.
- **E1 stays small** — docs are thin on purpose (no Jira theater).
- **E10 is small** — suite already exists; work is isolating two failing specs and locking the loading assertion.
- **E11 is mid** — skeleton UI already exists; the bug is a race (`setLoading(false)` after abort) plus `Suspense fallback={null}`.
- **E12 is largest in this line** — Apple’s top RSS is a single 100-item feed, so “backend pagination” is an application-layer `PagedResult` over the cached+filtered list. Virtualization is extra because page size 100 would otherwise mount 100 image cards.

## Working agreement

- Estimate the **next epic**, not the whole project every time.
- If a PR grows past ~8 source files, split before merge.
- Re-estimate when iTunes/AllOrigins behavior surprises us (spike ≤ 2 SP).
