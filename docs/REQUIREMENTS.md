# Requirements traceability

Maps the Inditex frontend challenge requirements to backlog epics and implementation notes in this repository.

| Requirement | Epic | Notes |
|-------------|------|-------|
| SPA with client-side navigation | E0 | React Router `BrowserRouter` |
| Dev unminified / prod minified | E0 | Webpack dual configs |
| Public repo + incremental commits + tags | E0, E1, E9 | Milestone tags through `v1.2.5`; review line `v1.3.0`–`v1.3.1` |
| README for both modes | E9 | [README.md](../README.md) |
| Clean URLs (no hash) | E0 | `historyApiFallback` + Router |
| Home top 100 podcasts | E3, E4 | Apple RSS via repository |
| Cache list 24h | E2, E3 | `CachedPodcastRepository` + localStorage |
| Live filter title + author | E2, E4 | `FilterPodcasts` use case |
| Navigate to podcast detail | E5 | `/podcast/:podcastId` |
| Podcast sidebar (image, title, author, description) | E5 | Shared `PodcastSidebar` |
| Episode count + list (title, date, duration) | E5 | `EpisodesTable` |
| Cache podcast detail 24h | E2, E3, E5 | Per-id cache key; enriched descriptions written back via `putPodcastDetail` |
| Navigate to episode | E6 | `/podcast/:id/episode/:episodeId` |
| Episode sidebar links back to podcast | E5, E6 | Title/cover links on sidebar |
| Episode title, HTML description, audio | E6 | DOMPurify + `<audio controls>` |
| Header title → home | E7 | App layout brand link |
| Loading indicator top-right on navigation | E7 | `AppLoadingContext` + header spinner |
| AllOrigins for CORS | E3 | Prod path; dev uses Webpack proxy |
| Console errors + visible retry | all | `console.error` plus in-page alert + Retry |
| Unit + e2e tests | E8 | Jest + Cypress suite (`test:e2e`); `smoke` re-runs Cypress against prod build |
| Changelog from Conventional Commits | E1 | git-cliff + CI check |
| Stable e2e (GFT review) | E10 | Fix 2 failing Cypress specs; assert skeleton instead of premature `Podcast not found` (`v1.2.4`) |
| Detail loading until resolve (GFT review) | E11 | Skeleton while in flight / aborted; `Podcast not found` only after a settled empty result (`v1.2.5`) |
| NTH: list pagination + page size (GFT review) | E12 | Application-layer `PagedResult` (iTunes top RSS is not paginated); UI page size 10/25/50/100 (`v1.3.0`) |
| Virtualized home grid | E12 | Window the current page so page size 100 does not mount 100 cards (`v1.3.1`) |

See also:

- [BACKLOG.md](./BACKLOG.md)
- [adr/0001-webpack.md](./adr/0001-webpack.md)
- [adr/0002-hexagonal.md](./adr/0002-hexagonal.md)
- [adr/0003-caching.md](./adr/0003-caching.md)
- [adr/0004-testing-strategy.md](./adr/0004-testing-strategy.md)
- [adr/0005-list-pagination.md](./adr/0005-list-pagination.md)
