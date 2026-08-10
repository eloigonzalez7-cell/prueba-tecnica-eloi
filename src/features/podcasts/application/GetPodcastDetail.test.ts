import { GetPodcastDetail } from "@/features/podcasts/application/GetPodcastDetail";
import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";

describe("GetPodcastDetail", () => {
  it("delegates to the podcast repository with id and abort signal", async () => {
    const podcast = new Podcast("42", "Title", "Author", {
      small: "s",
      medium: "m",
      large: "l",
    });
    const episode = new Episode(
      "7",
      "42",
      "Ep",
      "Desc",
      new Date("2024-01-01T00:00:00.000Z"),
      60_000,
      "https://example.com/audio.mp3",
    );
    const detail: PodcastDetail = { podcast, episodes: [episode] };
    const signal = new AbortController().signal;
    const podcastRepository: PodcastRepository = {
      getTopPodcasts: jest.fn(),
      getPodcastDetail: jest.fn().mockResolvedValue(detail),
    };

    const useCase = new GetPodcastDetail(podcastRepository);
    const result = await useCase.execute("42", signal);

    expect(result).toEqual(detail);
    expect(podcastRepository.getPodcastDetail).toHaveBeenCalledWith(
      "42",
      signal,
    );
  });
});
