# ADR 0005 — Application-layer list pagination

## Status

Accepted

## Context

GFT review asked for a paginated home list and a page-size control. Apple’s top podcasts RSS is a **single 100-item feed** (no `page`/`limit` query). A separate BFF would only wrap that same payload.

Live filter by title/author still needs the full cached list in memory.

## Decision

- Keep fetching and caching the full top 100 (`GetTopPodcasts` + 24h `CachedPodcastRepository`).
- Filter first (`FilterPodcasts`), then page with `PaginatePodcasts` → `{ items, total, page, pageSize, pageCount }`.
- UI exposes page sizes **10 / 25 / 50 / 100**. The badge shows the **filtered** total, not the page length.
- Treat this `PagedResult` as the “backend” contract: UI never slices arrays ad hoc.

## Consequences

- Honest about iTunes: no remote pagination, fewer round-trips, filter stays live.
- Page size 100 can still mount many image cards; virtualization (E12 / `v1.3.1`) windows the current page.
- Swapping in a real paginated API later only changes the repository adapter.
