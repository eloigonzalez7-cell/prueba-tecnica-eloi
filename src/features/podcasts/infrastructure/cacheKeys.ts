export const TOP_PODCASTS_CACHE_KEY = "podcasts:top:v1";

export function podcastDetailCacheKey(podcastId: string): string {
  return `podcasts:detail:${podcastId}:v1`;
}
