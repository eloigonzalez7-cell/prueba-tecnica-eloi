import { Podcast } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";

/**
 * Application use case: load a podcast and its episodes via the repository port.
 * When lookup omits the collection description, enrich it from the top-100 summary.
 */
export class GetPodcastDetail {
  constructor(private readonly podcastRepository: PodcastRepository) {}

  async execute(
    podcastId: string,
    signal?: AbortSignal,
  ): Promise<PodcastDetail> {
    const detail = await this.podcastRepository.getPodcastDetail(
      podcastId,
      signal,
    );

    if (detail.podcast.description.trim()) {
      return detail;
    }

    try {
      const top = await this.podcastRepository.getTopPodcasts(signal);
      const match = top.find((podcast) => podcast.id === podcastId);
      if (!match?.description.trim()) {
        return detail;
      }

      return {
        podcast: new Podcast(
          detail.podcast.id,
          detail.podcast.title,
          detail.podcast.author,
          detail.podcast.images,
          match.description,
        ),
        episodes: detail.episodes,
      };
    } catch (error) {
      console.error(error);
      return detail;
    }
  }
}
