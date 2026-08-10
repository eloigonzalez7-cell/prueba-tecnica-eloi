import type { Podcast } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";
import {
  mapPodcastDetail,
  mapTopPodcasts,
  type LookupResponse,
  type TopPodcastsFeed,
} from "@/features/podcasts/infrastructure/itunesMappers";
import {
  podcastLookupUrl,
  TOP_PODCASTS_URL,
} from "@/features/podcasts/infrastructure/itunesUrls";
import { toCorsSafeUrl } from "@/shared/http/corsProxy";
import {
  fetchJson,
  type FetchJsonOptions,
} from "@/shared/http/fetchJson";

type FetchJsonFn = <T>(
  url: string,
  options?: FetchJsonOptions,
) => Promise<T>;

export class ItunesPodcastRepository implements PodcastRepository {
  constructor(private readonly fetchJsonFn: FetchJsonFn = fetchJson) {}

  async getTopPodcasts(signal?: AbortSignal): Promise<Podcast[]> {
    const url = toCorsSafeUrl(TOP_PODCASTS_URL);
    const payload = await this.fetchJsonFn<TopPodcastsFeed>(url, { signal });
    return mapTopPodcasts(payload);
  }

  async getPodcastDetail(
    podcastId: string,
    signal?: AbortSignal,
  ): Promise<PodcastDetail> {
    const url = toCorsSafeUrl(podcastLookupUrl(podcastId));
    const payload = await this.fetchJsonFn<LookupResponse>(url, { signal });
    return mapPodcastDetail(payload, podcastId);
  }

  putPodcastDetail(_detail: PodcastDetail): void {
    // Remote adapter has no client-side persistence.
  }
}
