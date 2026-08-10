import type { CacheStore } from "@/features/podcasts/domain/CacheStore";
import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast, type PodcastImages } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";
import {
  podcastDetailCacheKey,
  TOP_PODCASTS_CACHE_KEY,
} from "@/features/podcasts/infrastructure/cacheKeys";
import { ONE_DAY_MS } from "@/features/podcasts/infrastructure/cacheTtl";

type PodcastJson = {
  id: string;
  title: string;
  author: string;
  images: PodcastImages;
  description: string;
};

type EpisodeJson = {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationMs: number;
  audioUrl: string;
};

type DetailJson = {
  podcast: PodcastJson;
  episodes: EpisodeJson[];
};

function serializePodcast(podcast: Podcast): PodcastJson {
  return {
    id: podcast.id,
    title: podcast.title,
    author: podcast.author,
    images: podcast.images,
    description: podcast.description,
  };
}

function revivePodcast(json: PodcastJson): Podcast {
  return new Podcast(
    json.id,
    json.title,
    json.author,
    json.images,
    json.description,
  );
}

function serializeDetail(detail: PodcastDetail): DetailJson {
  return {
    podcast: serializePodcast(detail.podcast),
    episodes: detail.episodes.map((episode) => ({
      id: episode.id,
      podcastId: episode.podcastId,
      title: episode.title,
      description: episode.description,
      publishedAt: episode.publishedAt.toISOString(),
      durationMs: episode.durationMs,
      audioUrl: episode.audioUrl,
    })),
  };
}

function reviveDetail(json: DetailJson): PodcastDetail {
  return {
    podcast: revivePodcast(json.podcast),
    episodes: json.episodes.map(
      (episode) =>
        new Episode(
          episode.id,
          episode.podcastId,
          episode.title,
          episode.description,
          new Date(episode.publishedAt),
          episode.durationMs,
          episode.audioUrl,
        ),
    ),
  };
}

/**
 * Decorator: serve top list / detail from CacheStore (24h) before hitting the inner repo.
 */
export class CachedPodcastRepository implements PodcastRepository {
  constructor(
    private readonly inner: PodcastRepository,
    private readonly cache: CacheStore,
    private readonly ttlMs: number = ONE_DAY_MS,
  ) {}

  async getTopPodcasts(signal?: AbortSignal): Promise<Podcast[]> {
    const cached = this.cache.get<PodcastJson[]>(TOP_PODCASTS_CACHE_KEY);
    if (cached) {
      return cached.map(revivePodcast);
    }

    const podcasts = await this.inner.getTopPodcasts(signal);
    this.cache.set(
      TOP_PODCASTS_CACHE_KEY,
      podcasts.map(serializePodcast),
      this.ttlMs,
    );
    return podcasts;
  }

  async getPodcastDetail(
    podcastId: string,
    signal?: AbortSignal,
  ): Promise<PodcastDetail> {
    const key = podcastDetailCacheKey(podcastId);
    const cached = this.cache.get<DetailJson>(key);
    if (cached) {
      return reviveDetail(cached);
    }

    const detail = await this.inner.getPodcastDetail(podcastId, signal);
    this.cache.set(key, serializeDetail(detail), this.ttlMs);
    return detail;
  }
}
