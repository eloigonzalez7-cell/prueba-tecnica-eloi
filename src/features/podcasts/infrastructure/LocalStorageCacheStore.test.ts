import { ONE_DAY_MS } from "@/features/podcasts/infrastructure/cacheTtl";
import { LocalStorageCacheStore } from "@/features/podcasts/infrastructure/LocalStorageCacheStore";

class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  get length() {
    return this.data.size;
  }

  clear() {
    this.data.clear();
  }

  getItem(key: string) {
    return this.data.has(key) ? (this.data.get(key) ?? null) : null;
  }

  key(index: number) {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("LocalStorageCacheStore", () => {
  it("returns cached value within TTL", () => {
    let now = 1_000_000;
    const store = new LocalStorageCacheStore(new MemoryStorage(), () => now);

    store.set("top", { ids: ["1"] });
    expect(store.get<{ ids: string[] }>("top")).toEqual({ ids: ["1"] });

    now += ONE_DAY_MS - 1;
    expect(store.get<{ ids: string[] }>("top")).toEqual({ ids: ["1"] });
  });

  it("returns null after 24h and removes the entry", () => {
    let now = 1_000_000;
    const storage = new MemoryStorage();
    const store = new LocalStorageCacheStore(storage, () => now);

    store.set("top", { ids: ["1"] });
    now += ONE_DAY_MS;
    expect(store.get("top")).toBeNull();
    expect(storage.getItem("top")).toBeNull();
  });

  it("ignores corrupt payloads", () => {
    const storage = new MemoryStorage();
    storage.setItem("top", "{not-json");
    const store = new LocalStorageCacheStore(storage, () => 0);

    expect(store.get("top")).toBeNull();
    expect(storage.getItem("top")).toBeNull();
  });

  it("ignores outdated schema versions", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "top",
      JSON.stringify({
        schemaVersion: 0,
        storedAt: 0,
        ttlMs: ONE_DAY_MS,
        value: { ids: ["1"] },
      }),
    );
    const store = new LocalStorageCacheStore(storage, () => 0);

    expect(store.get("top")).toBeNull();
  });
});
