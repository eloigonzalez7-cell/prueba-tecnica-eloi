# ADR 0002 — Hexagonal feature modules on the frontend

## Status

Accepted

## Context

Reviewers value clear separation of domain concepts, use cases, and screens. A flat `components/` folder tends to mix HTTP, mapping, and JSX.

## Decision

Organize the podcasts capability as a hexagonal feature under `src/features/podcasts/`:

- **domain** — entities (`Podcast`, `Episode`) and ports (`PodcastRepository`, `CacheStore`)
- **application** — use cases (`GetTopPodcasts`, `FilterPodcasts`, `GetPodcastDetail`)
- **infrastructure** — iTunes repository, AllOrigins/dev proxy, mappers, cached decorator, localStorage
- **ui** — React pages, presentational components, composition root (`podcastDependencies`)

Shared kernel under `src/shared/` (HTTP client, HTML sanitize, tokens). App shell under `src/app/`.

## Consequences

- Use cases are unit-testable without DOM or network
- Swapping the HTTP proxy or cache store does not touch UI
- Slightly more files; the README and this ADR explain the layout
