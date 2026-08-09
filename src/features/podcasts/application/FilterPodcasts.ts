import type { Podcast } from "../domain/Podcast";

/**
 * Pure use case: live filter by podcast title or author (case-insensitive).
 */
export class FilterPodcasts {
  execute(podcasts: readonly Podcast[], query: string): Podcast[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [...podcasts];
    }

    return podcasts.filter((podcast) => {
      const title = podcast.title.toLowerCase();
      const author = podcast.author.toLowerCase();
      return title.includes(normalized) || author.includes(normalized);
    });
  }
}
