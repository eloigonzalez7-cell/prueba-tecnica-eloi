import type { CacheStore } from "@/features/podcasts/domain/CacheStore";
import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";
import { CachedPodcastRepository } from "@/features/podcasts/infrastructure/CachedPodcastRepository";
import { TOP_PODCASTS_CACHE_KEY } from "@/features/podcasts/infrastructure/cacheKeys";

const images = { small: "s", medium: "m", large: "l" };

function createMemoryCache(): CacheStore & { store: Map<string, unknown> } {
  const store = new Map<string, unknown>();
  return {
    store,
    get<T>(key: string) {
      return (store.get(key) as T | undefined) ?? null;
    },
    set<T>(key: string, value: T) {
      store.set(key, value);
    },
    remove(key: string) {
      store.delete(key);
    },
  };
}

describe("CachedPodcastRepository", () => {
  const podcast = new Podcast("1", "Title", "Author", images, "Desc");
  const detail: PodcastDetail = {
    podcast,
    episodes: [
      new Episode(
        "e1",
        "1",
        "Ep 1",
        "d",
        new Date("2024-01-01T00:00:00.000Z"),
        1000,
        "https://example.com/a.mp3",
      ),
    ],
  };

  it("returns cached top podcasts without calling the inner repository", async () => {
    const inner: PodcastRepository = {
      getTopPodcasts: jest.fn().mockResolvedValue([podcast]),
      getPodcastDetail: jest.fn(),
      putPodcastDetail: jest.fn(),
    };
    const cache = createMemoryCache();
    const repository = new CachedPodcastRepository(inner, cache);

    const first = await repository.getTopPodcasts();
    const second = await repository.getTopPodcasts();

    expect(first[0]).toBeInstanceOf(Podcast);
    expect(second[0]?.id).toBe("1");
    expect(inner.getTopPodcasts).toHaveBeenCalledTimes(1);
    expect(cache.store.has(TOP_PODCASTS_CACHE_KEY)).toBe(true);
  });

  it("caches podcast detail per id and revives Date fields", async () => {
    const inner: PodcastRepository = {
      getTopPodcasts: jest.fn(),
      getPodcastDetail: jest.fn().mockResolvedValue(detail),
      putPodcastDetail: jest.fn(),
    };
    const repository = new CachedPodcastRepository(inner, createMemoryCache());

    const first = await repository.getPodcastDetail("1");
    const second = await repository.getPodcastDetail("1");

    expect(inner.getPodcastDetail).toHaveBeenCalledTimes(1);
    expect(second.episodes[0]).toBeInstanceOf(Episode);
    expect(second.episodes[0]?.publishedAt.toISOString()).toBe(
      "2024-01-01T00:00:00.000Z",
    );
    expect(first.podcast.title).toBe("Title");
  });

  it("honours AbortSignal on cache hits", async () => {
    const inner: PodcastRepository = {
      getTopPodcasts: jest.fn().mockResolvedValue([podcast]),
      getPodcastDetail: jest.fn().mockResolvedValue(detail),
      putPodcastDetail: jest.fn(),
    };
    const repository = new CachedPodcastRepository(inner, createMemoryCache());
    await repository.getTopPodcasts();
    await repository.getPodcastDetail("1");

    const controller = new AbortController();
    controller.abort();

    await expect(repository.getTopPodcasts(controller.signal)).rejects.toMatchObject({
      name: "AbortError",
    });
    await expect(
      repository.getPodcastDetail("1", controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("persists putPodcastDetail into the cache for later hits", async () => {
    const inner: PodcastRepository = {
      getTopPodcasts: jest.fn(),
      getPodcastDetail: jest.fn(),
      putPodcastDetail: jest.fn(),
    };
    const repository = new CachedPodcastRepository(inner, createMemoryCache());
    const enriched: PodcastDetail = {
      podcast: new Podcast("1", "Title", "Author", images, "Enriched"),
      episodes: detail.episodes,
    };

    repository.putPodcastDetail(enriched);
    const cached = await repository.getPodcastDetail("1");

    expect(inner.getPodcastDetail).not.toHaveBeenCalled();
    expect(cached.podcast.description).toBe("Enriched");
    expect(inner.putPodcastDetail).toHaveBeenCalledWith(enriched);
  });
});
