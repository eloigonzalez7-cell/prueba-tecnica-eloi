import { Podcast } from "../domain/Podcast";
import type { PodcastRepository } from "../domain/PodcastRepository";
import { GetTopPodcasts } from "./GetTopPodcasts";

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
    };

    const useCase = new GetTopPodcasts(podcastRepository);
    const result = await useCase.execute(signal);

    expect(result).toEqual([podcast]);
    expect(podcastRepository.getTopPodcasts).toHaveBeenCalledWith(signal);
  });
});
