import { GetTopPodcasts } from "../application/GetTopPodcasts";
import { CachedPodcastRepository } from "../infrastructure/CachedPodcastRepository";
import { ItunesPodcastRepository } from "../infrastructure/ItunesPodcastRepository";
import { LocalStorageCacheStore } from "../infrastructure/LocalStorageCacheStore";

const cacheStore = new LocalStorageCacheStore();
const itunesRepository = new ItunesPodcastRepository();
const podcastRepository = new CachedPodcastRepository(
  itunesRepository,
  cacheStore,
);

export const getTopPodcasts = new GetTopPodcasts(podcastRepository);
