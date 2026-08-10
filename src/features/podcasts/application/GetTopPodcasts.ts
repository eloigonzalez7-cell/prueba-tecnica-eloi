import type { Podcast } from "@/features/podcasts/domain/Podcast";
import type { PodcastRepository } from "@/features/podcasts/domain/PodcastRepository";

/**
 * Application use case: load the top podcasts list via the repository port.
 */
export class GetTopPodcasts {
  constructor(private readonly podcastRepository: PodcastRepository) {}

  execute(signal?: AbortSignal): Promise<Podcast[]> {
    return this.podcastRepository.getTopPodcasts(signal);
  }
}
