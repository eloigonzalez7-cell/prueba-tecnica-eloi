import { toCorsSafeUrl } from "@/shared/http/corsProxy";

describe("toCorsSafeUrl", () => {
  const itunesUrl =
    "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";

  it("rewrites iTunes URLs to the webpack proxy in development", () => {
    expect(toCorsSafeUrl(itunesUrl, { useDevProxy: true })).toBe(
      "/itunes-proxy/us/rss/toppodcasts/limit=100/genre=1310/json",
    );
  });

  it("wraps iTunes URLs with AllOrigins in production", () => {
    const safe = toCorsSafeUrl(itunesUrl, { useDevProxy: false });
    expect(safe.startsWith("https://api.allorigins.win/raw?url=")).toBe(true);
    expect(safe).toContain(encodeURIComponent(itunesUrl));
  });

  it("does not rewrite non-iTunes URLs when using the dev proxy", () => {
    expect(
      toCorsSafeUrl("https://example.com/data.json", { useDevProxy: true }),
    ).toBe("https://example.com/data.json");
  });
});
