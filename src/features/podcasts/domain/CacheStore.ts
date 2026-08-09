/**
 * Outbound port for client-side persistence (e.g. localStorage with TTL).
 * Adapters decide storage medium; use cases only see get/set/remove.
 */
export interface CacheStore {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs?: number): void;
  remove(key: string): void;
}
