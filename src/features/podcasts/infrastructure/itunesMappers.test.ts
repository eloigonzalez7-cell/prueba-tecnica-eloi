import { mapPodcastDetail, mapTopPodcasts } from "@/features/podcasts/infrastructure/itunesMappers";
import podcastLookup from "@/features/podcasts/infrastructure/__fixtures__/podcastLookup.sample.json";
import topPodcasts from "@/features/podcasts/infrastructure/__fixtures__/topPodcasts.sample.json";

describe("mapTopPodcasts", () => {
  it("maps feed entries to Podcast entities with multi-size images", () => {
    const podcasts = mapTopPodcasts(topPodcasts);

    expect(podcasts).toHaveLength(1);
    expect(podcasts[0]).toMatchObject({
      id: "1535809341",
      title: "The Joe Budden Podcast",
      author: "The Joe Budden Network",
      description: "Tune into Joe Budden",
      images: {
        small: "https://example.com/55.jpg",
        medium: "https://example.com/170.jpg",
        large: "https://example.com/170.jpg",
      },
    });
  });

  it("skips entries without a stable id", () => {
    const podcasts = mapTopPodcasts({
      feed: {
        entry: [
          {
            "im:name": { label: "Broken" },
            "im:artist": { label: "Nobody" },
          },
        ],
      },
    });

    expect(podcasts).toEqual([]);
  });
});

describe("mapPodcastDetail", () => {
  it("maps collection and episodes with stable track ids", () => {
    const detail = mapPodcastDetail(podcastLookup, "1535809341");

    expect(detail.podcast).toMatchObject({
      id: "1535809341",
      title: "The Joe Budden Podcast",
      author: "The Joe Budden Network",
      images: {
        small: "https://example.com/60.jpg",
        medium: "https://example.com/100.jpg",
        large: "https://example.com/600.jpg",
      },
    });

    expect(detail.episodes).toHaveLength(2);
    expect(detail.episodes[0]).toMatchObject({
      id: "1000000001",
      podcastId: "1535809341",
      title: "Episode 1",
      durationMs: 3_600_000,
      audioUrl: "https://example.com/ep1.mp3",
    });
    expect(detail.episodes[0]?.publishedAt.toISOString()).toBe(
      "2024-01-15T10:00:00.000Z",
    );
  });
});
