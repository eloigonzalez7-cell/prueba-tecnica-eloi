import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast } from "@/features/podcasts/domain/Podcast";

describe("Podcast", () => {
  it("creates a podcast with stable identity fields", () => {
    const podcast = new Podcast(
      "123",
      "The Daily",
      "NYT",
      {
        small: "https://example.com/s.jpg",
        medium: "https://example.com/m.jpg",
        large: "https://example.com/l.jpg",
      },
      "News podcast",
    );

    expect(podcast.id).toBe("123");
    expect(podcast.title).toBe("The Daily");
    expect(podcast.author).toBe("NYT");
    expect(podcast.description).toBe("News podcast");
    expect(podcast.images.medium).toContain("m.jpg");
  });

  it("rejects empty id", () => {
    expect(
      () =>
        new Podcast("", "Title", "Author", {
          small: "",
          medium: "",
          large: "",
        }),
    ).toThrow("Podcast id is required");
  });
});

describe("Episode", () => {
  it("creates an episode linked to a podcast", () => {
    const publishedAt = new Date("2024-01-15T10:00:00.000Z");
    const episode = new Episode(
      "ep-1",
      "123",
      "Episode One",
      "<p>Hello</p>",
      publishedAt,
      3_600_000,
      "https://example.com/audio.mp3",
    );

    expect(episode.id).toBe("ep-1");
    expect(episode.podcastId).toBe("123");
    expect(episode.durationMs).toBe(3_600_000);
    expect(episode.publishedAt).toEqual(publishedAt);
  });

  it("rejects invalid publishedAt", () => {
    expect(
      () =>
        new Episode(
          "ep-1",
          "123",
          "Title",
          "",
          new Date("not-a-date"),
          0,
          "https://example.com/a.mp3",
        ),
    ).toThrow("Episode publishedAt must be a valid date");
  });
});
