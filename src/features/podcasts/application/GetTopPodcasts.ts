import type { Podcast } from "../domain/Podcast";
import type { PodcastRepository } from "../domain/PodcastRepository";

/**
 * Application use case: load the top podcasts list via the repository port.
 */
export class GetTopPodcasts {
  constructor(private readonly podcastRepository: PodcastRepository) {}

  execute(signal?: AbortSignal): Promise<Podcast[]> {
    return this.podcastRepository.getTopPodcasts(signal);
  }
}
