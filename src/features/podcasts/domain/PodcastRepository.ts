import type { Episode } from "./Episode";
import type { Podcast } from "./Podcast";

export type PodcastDetail = {
  readonly podcast: Podcast;
  readonly episodes: readonly Episode[];
};

/**
 * Outbound port: application depends on this contract, not on iTunes/HTTP.
 */
export interface PodcastRepository {
  getTopPodcasts(signal?: AbortSignal): Promise<Podcast[]>;
  getPodcastDetail(
    podcastId: string,
    signal?: AbortSignal,
  ): Promise<PodcastDetail>;
}
