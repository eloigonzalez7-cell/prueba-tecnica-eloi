export const TOP_PODCASTS_URL =
  "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";

export function podcastLookupUrl(podcastId: string): string {
  // Keep limit=20 to match the Inditex brief sample lookup URL.
  const params = new URLSearchParams({
    id: podcastId,
    media: "podcast",
    entity: "podcastEpisode",
    limit: "20",
  });
  return `https://itunes.apple.com/lookup?${params.toString()}`;
}
