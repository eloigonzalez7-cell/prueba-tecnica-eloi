export class Episode {
  constructor(
    readonly id: string,
    readonly podcastId: string,
    readonly title: string,
    readonly description: string,
    readonly publishedAt: Date,
    readonly durationMs: number,
    readonly audioUrl: string,
  ) {
    if (!id.trim()) {
      throw new Error("Episode id is required");
    }
    if (!podcastId.trim()) {
      throw new Error("Episode podcastId is required");
    }
    if (!title.trim()) {
      throw new Error("Episode title is required");
    }
    if (Number.isNaN(publishedAt.getTime())) {
      throw new Error("Episode publishedAt must be a valid date");
    }
    if (!Number.isFinite(durationMs) || durationMs < 0) {
      throw new Error("Episode durationMs must be a non-negative number");
    }
  }
}
