import type { CacheStore } from "../domain/CacheStore";
import { CACHE_SCHEMA_VERSION, ONE_DAY_MS } from "./cacheTtl";

type CacheEnvelope<T> = {
  schemaVersion: typeof CACHE_SCHEMA_VERSION;
  storedAt: number;
  ttlMs: number;
  value: T;
};

export class LocalStorageCacheStore implements CacheStore {
  constructor(
    private readonly storage: Storage = globalThis.localStorage,
    private readonly now: () => number = () => Date.now(),
    private readonly defaultTtlMs: number = ONE_DAY_MS,
  ) {}

  get<T>(key: string): T | null {
    const raw = this.storage.getItem(key);
    if (raw === null) {
      return null;
    }

    try {
      const envelope = JSON.parse(raw) as CacheEnvelope<T>;
      if (envelope.schemaVersion !== CACHE_SCHEMA_VERSION) {
        this.remove(key);
        return null;
      }

      const expiresAt = envelope.storedAt + envelope.ttlMs;
      if (this.now() >= expiresAt) {
        this.remove(key);
        return null;
      }

      return envelope.value;
    } catch {
      this.remove(key);
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    const envelope: CacheEnvelope<T> = {
      schemaVersion: CACHE_SCHEMA_VERSION,
      storedAt: this.now(),
      ttlMs,
      value,
    };

    try {
      this.storage.setItem(key, JSON.stringify(envelope));
    } catch {
      // Quota / private mode: ignore persistence failures (errors go to console in adapters later).
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
