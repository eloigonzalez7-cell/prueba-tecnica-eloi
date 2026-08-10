# ADR 0003 — 24-hour localStorage cache

## Status

Accepted

## Context

The brief requires client-side storage of the top podcasts list and podcast detail payloads, refreshing only after more than one day.

## Decision

Implement a versioned `CacheStore` port with a `LocalStorageCacheStore` adapter, wrapped by `CachedPodcastRepository`:

- Envelope: `{ schemaVersion, storedAt, ttlMs, value }`
- Default TTL = `24 * 60 * 60 * 1000` ms
- Separate keys for top list vs podcast detail by id
- Schema version invalidates breaking mapper/cache shape changes
- Unit tests freeze time to assert hit/miss behaviour
- Persistence failures (quota / private mode) are ignored; network errors go to `console.error`

## Consequences

- Fewer upstream calls and faster revisits
- Stale data up to 24h (accepted by the brief)
- Empty podcast descriptions from lookup are enriched at use-case level from the (often cached) top-100 summaries
