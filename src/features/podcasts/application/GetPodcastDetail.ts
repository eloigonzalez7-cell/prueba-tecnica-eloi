import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";

/**
 * Application use case: load a podcast and its episodes via the repository port.
 */
export class GetPodcastDetail {
  constructor(private readonly podcastRepository: PodcastRepository) {}

  execute(podcastId: string, signal?: AbortSignal): Promise<PodcastDetail> {
    return this.podcastRepository.getPodcastDetail(podcastId, signal);
  }
}
