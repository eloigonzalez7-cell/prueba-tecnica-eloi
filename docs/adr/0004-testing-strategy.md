# ADR 0004 — Testing strategy

## Status

Accepted

## Context

The challenge asks for unit tests and e2e. Domain rules (filter, TTL cache, mappers) must be proven without flaky network calls. Production artefacts should be smoke-tested with the same flows.

## Decision

- **Jest + Testing Library** — unit tests for domain/application/infrastructure; RTL for critical UI (`HomePage` filter/error/loading); fake repositories and mocked clocks for TTL; jsdom for DOM helpers (DOMPurify)
- **Cypress e2e suite** — feature specs under `cypress/e2e/` with typed custom commands (`stubItunesApis`, `stubTopPodcastsFailure`):
  - home filter (title/author) + error/retry
  - navigation chrome (loading spinner, brand → home)
  - podcast/episode happy path + deep link
  - 24h client cache (no duplicate top-list fetch on revisit)
- **`npm run smoke`** — serve `dist/` on `:4173` and run **the same Cypress suite** with prod `baseUrl` (not a separate thinner test style)
- **CI** — `typecheck` + `lint` + unit tests + production build + `e2e-smoke` job; changelog drift check (strict on version tags)

E2E intercepts match both the Webpack `/itunes-proxy` (dev) and AllOrigins URLs (prod).

## Consequences

- Fast feedback on business rules
- E2E does not depend on live Apple/AllOrigins availability in CI
- Evaluators can open `npm run cypress:open` and see a structured Cypress project, not a single smoke script
- Additional tooling (`cypress`, `start-server-and-test`) and CI minutes
