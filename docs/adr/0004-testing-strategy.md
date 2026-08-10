# ADR 0004 — Testing strategy

## Status

Accepted

## Context

The challenge asks for unit tests and e2e. Domain rules (filter, TTL cache, mappers) must be proven without flaky network calls. Production artefacts should be smoke-tested.

## Decision

- **Jest + Testing Library** — unit tests; fake repositories and mocked clocks for TTL; jsdom for DOM-related helpers (DOMPurify)
- **Cypress** — e2e happy path across home → podcast → episode with fixture intercepts
- **`npm run smoke`** — serve `dist/` on `:4173` via `start-server-and-test`, then Cypress with prod `baseUrl`
- **CI** — `lint` + unit tests + production build + `e2e-smoke` job; changelog drift check (strict on version tags)

E2E intercepts match both the Webpack `/itunes-proxy` (dev) and AllOrigins URLs (prod).

## Consequences

- Fast feedback on business rules
- E2E does not depend on live Apple/AllOrigins availability in CI
- Additional tooling (`cypress`, `start-server-and-test`) and CI minutes
