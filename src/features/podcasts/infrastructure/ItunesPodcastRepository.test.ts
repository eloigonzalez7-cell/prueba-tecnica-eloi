import { ItunesPodcastRepository } from "@/features/podcasts/infrastructure/ItunesPodcastRepository";
import { TOP_PODCASTS_URL } from "@/features/podcasts/infrastructure/itunesUrls";
import podcastLookup from "@/features/podcasts/infrastructure/__fixtures__/podcastLookup.sample.json";
import topPodcasts from "@/features/podcasts/infrastructure/__fixtures__/topPodcasts.sample.json";

describe("ItunesPodcastRepository", () => {
  it("loads top podcasts through the CORS-safe URL", async () => {
    const fetchJsonFn = jest.fn().mockResolvedValue(topPodcasts);
    const repository = new ItunesPodcastRepository(fetchJsonFn);

    const podcasts = await repository.getTopPodcasts();

    expect(podcasts[0]?.id).toBe("1535809341");
    expect(fetchJsonFn).toHaveBeenCalledTimes(1);
    const calledUrl = fetchJsonFn.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("allorigins.win");
    expect(calledUrl).toContain(encodeURIComponent(TOP_PODCASTS_URL));
  });

  it("loads podcast detail and episodes", async () => {
    const fetchJsonFn = jest.fn().mockResolvedValue(podcastLookup);
    const repository = new ItunesPodcastRepository(fetchJsonFn);
    const signal = new AbortController().signal;

    const detail = await repository.getPodcastDetail("1535809341", signal);

    expect(detail.podcast.id).toBe("1535809341");
    expect(detail.episodes).toHaveLength(2);
    expect(fetchJsonFn).toHaveBeenCalledWith(expect.any(String), { signal });
  });
});
