export type PodcastImages = {
  readonly small: string;
  readonly medium: string;
  readonly large: string;
};

export class Podcast {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly author: string,
    readonly images: PodcastImages,
    readonly description: string = "",
  ) {
    if (!id.trim()) {
      throw new Error("Podcast id is required");
    }
    if (!title.trim()) {
      throw new Error("Podcast title is required");
    }
    if (!author.trim()) {
      throw new Error("Podcast author is required");
    }
  }
}
