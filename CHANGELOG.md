# Changelog

All notable changes to Podcaster are documented here.
Generated from Conventional Commits and git tags via [git-cliff](https://git-cliff.org).

## [1.2.4] - 2026-08-13

### Testing

- **e2e:** wait for podcast sidebar instead of a single lookup
## [1.2.3] - 2026-08-13

### Documentation

- **review:** capture GFT technical feedback
- **review:** capture GFT technical feedback (#54)
## [1.2.2] - 2026-08-10

### Bug Fixes

- linkify bare URLs in podcast sidebar descriptions
## [1.2.1] - 2026-08-10

### Documentation

- sync README with v1.2.0 delivery

### Testing

- cover PodcastDetailPage load and retry
## [1.2.0] - 2026-08-10

### Bug Fixes

- linkify bare URLs in episode descriptions

### Documentation

- align milestone tags with v1.1.0

### Testing

- expand Cypress into a structured e2e suite
## [1.1.0] - 2026-08-10

### Documentation

- update changelog for v1.0.0
- update changelog for v1.1.0

### Miscellaneous

- upgrade to TypeScript 6 and ES2024
- complete P2 hardening (cache write-back, lazy routes, lint)

### Testing

- harden UI coverage and load error UX
## [1.0.0] - 2026-08-10

### Documentation

- update changelog for v0.7.0-tests
- complete readme with runbook
- add delivery adrs and requirements traceability
## [0.7.0-tests] - 2026-08-10

### Bug Fixes

- **podcasts:** enrich descriptions, align home UI, add prod smoke

### Documentation

- update changelog for v0.6.0-chrome

### Testing

- add cypress tooling
- add cypress happy path across three views
## [0.6.0-chrome] - 2026-08-10

### Documentation

- update changelog for v0.5.0-episode

### Features

- **app:** add header link to home
- **app:** show loading indicator on client navigation
## [0.5.0-episode] - 2026-08-10

### Documentation

- update changelog for v0.4.0-detail

### Features

- **shared:** sanitize episode html descriptions
- **episode:** add episode detail with audio player
## [0.4.0-detail] - 2026-08-10

### Documentation

- update changelog for v0.3.0-home

### Features

- **podcasts:** add get podcast detail use case
- **podcast:** add podcast detail sidebar
- **podcast:** list episodes with date and duration
## [0.3.0-home] - 2026-08-10

### Documentation

- update changelog for v0.2.1-data

### Features

- **podcasts:** add get top podcasts use case
- **home:** render top podcasts grid
- **home:** add live filter with semantic markup

### Miscellaneous

- add path aliases for src imports
## [0.2.1-data] - 2026-08-10

### Bug Fixes

- **podcasts:** export itunes mapper payload types

### Documentation

- update changelog for v0.2.0-domain

### Features

- **shared:** add http client with abort
- **shared:** add allorigins cors adapter
- **podcasts:** map itunes payloads to domain
- **podcasts:** implement itunes repository
- **podcasts:** wrap repository with cache
## [0.2.0-domain] - 2026-08-09

### Bug Fixes

- point changelog script to local git-cliff binary

### Features

- **podcasts:** add domain models
- **podcasts:** add repository ports
- **podcasts:** add 24h local storage cache
- **podcasts:** add filter podcasts use case
## [0.1.0-foundation] - 2026-08-09

### CI

- add lint test build workflow
- add git-cliff changelog workflow

### Documentation

- add backlog and estimations

### Features

- **app:** bootstrap react entrypoint
- **app:** add clean url router shell

### Miscellaneous

- add package manifest and engines
- add strict typescript config
- add webpack common config
- add webpack dev and prod configs
- add eslint flat config

### Testing

- add jest and smoke test
## [0.0.0-init] - 2026-08-09

### Documentation

- add readme and gitignore

