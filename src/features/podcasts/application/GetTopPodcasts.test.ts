import { GetTopPodcasts } from "@/features/podcasts/application/GetTopPodcasts";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import type { PodcastRepository } from "@/features/podcasts/domain/PodcastRepository";

describe("GetTopPodcasts", () => {
  it("delegates to the podcast repository with the abort signal", async () => {
    const podcast = new Podcast("1", "Title", "Author", {
      small: "s",
      medium: "m",
      large: "l",
    });
    const signal = new AbortController().signal;
    const podcastRepository: PodcastRepository = {
      getTopPodcasts: jest.fn().mockResolvedValue([podcast]),
      getPodcastDetail: jest.fn(),
      putPodcastDetail: jest.fn(),
    };

    const useCase = new GetTopPodcasts(podcastRepository);
    const result = await useCase.execute(signal);

    expect(result).toEqual([podcast]);
    expect(podcastRepository.getTopPodcasts).toHaveBeenCalledWith(signal);
  });
});
