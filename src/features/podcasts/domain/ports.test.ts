import type { CacheStore } from "./CacheStore";
import type { PodcastRepository } from "./PodcastRepository";
import { Podcast } from "./Podcast";

describe("domain ports", () => {
  it("allows a fake PodcastRepository to satisfy the port", async () => {
    const podcast = new Podcast("1", "Title", "Author", {
      small: "s",
      medium: "m",
      large: "l",
    });

    const repository: PodcastRepository = {
      async getTopPodcasts() {
        return [podcast];
      },
      async getPodcastDetail(_podcastId) {
        return { podcast, episodes: [] };
      },
    };

    await expect(repository.getTopPodcasts()).resolves.toHaveLength(1);
    await expect(repository.getPodcastDetail("1")).resolves.toMatchObject({
      podcast: { id: "1" },
      episodes: [],
    });
  });

  it("allows an in-memory CacheStore to satisfy the port", () => {
    const memory = new Map<string, unknown>();
    const cache: CacheStore = {
      get<T>(key: string) {
        return (memory.get(key) as T | undefined) ?? null;
      },
      set<T>(key: string, value: T) {
        memory.set(key, value);
      },
      remove(key: string) {
        memory.delete(key);
      },
    };

    cache.set("k", { ok: true });
    expect(cache.get<{ ok: boolean }>("k")).toEqual({ ok: true });
    cache.remove("k");
    expect(cache.get("k")).toBeNull();
  });
});
