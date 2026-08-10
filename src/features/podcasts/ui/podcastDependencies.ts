import { FilterPodcasts } from "@/features/podcasts/application/FilterPodcasts";
import { GetTopPodcasts } from "@/features/podcasts/application/GetTopPodcasts";
import { CachedPodcastRepository } from "@/features/podcasts/infrastructure/CachedPodcastRepository";
import { ItunesPodcastRepository } from "@/features/podcasts/infrastructure/ItunesPodcastRepository";
import { LocalStorageCacheStore } from "@/features/podcasts/infrastructure/LocalStorageCacheStore";

const cacheStore = new LocalStorageCacheStore();
const itunesRepository = new ItunesPodcastRepository();
const podcastRepository = new CachedPodcastRepository(
  itunesRepository,
  cacheStore,
);

export const getTopPodcasts = new GetTopPodcasts(podcastRepository);
export const filterPodcasts = new FilterPodcasts();
