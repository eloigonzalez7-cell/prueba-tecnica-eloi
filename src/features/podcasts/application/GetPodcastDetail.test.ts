import { GetPodcastDetail } from "@/features/podcasts/application/GetPodcastDetail";
import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import type {
  PodcastDetail,
  PodcastRepository,
} from "@/features/podcasts/domain/PodcastRepository";

const images = { small: "s", medium: "m", large: "l" };

function episodeFor(podcastId: string): Episode {
  return new Episode(
    "7",
    podcastId,
    "Ep",
    "Desc",
    new Date("2024-01-01T00:00:00.000Z"),
    60_000,
    "https://example.com/audio.mp3",
  );
}

describe("GetPodcastDetail", () => {
  it("delegates to the podcast repository with id and abort signal", async () => {
    const podcast = new Podcast("42", "Title", "Author", images, "About");
    const detail: PodcastDetail = {
      podcast,
      episodes: [episodeFor("42")],
    };
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
    expect(podcastRepository.getTopPodcasts).not.toHaveBeenCalled();
  });

  it("enriches empty podcast description from the top list summary", async () => {
    const detail: PodcastDetail = {
      podcast: new Podcast("99", "Show", "Host", images, ""),
      episodes: [episodeFor("99")],
    };
    const podcastRepository: PodcastRepository = {
      getTopPodcasts: jest.fn().mockResolvedValue([
        new Podcast("99", "Show", "Host", images, "From top feed summary"),
      ]),
      getPodcastDetail: jest.fn().mockResolvedValue(detail),
    };

    const useCase = new GetPodcastDetail(podcastRepository);
    const result = await useCase.execute("99");

    expect(result.podcast.description).toBe("From top feed summary");
    expect(result.episodes).toEqual(detail.episodes);
    expect(podcastRepository.getTopPodcasts).toHaveBeenCalled();
  });
});
