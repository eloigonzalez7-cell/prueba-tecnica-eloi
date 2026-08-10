import type { Episode } from "@/features/podcasts/domain/Episode";
import type { Podcast } from "@/features/podcasts/domain/Podcast";

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
