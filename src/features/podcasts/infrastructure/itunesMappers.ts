import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast, type PodcastImages } from "@/features/podcasts/domain/Podcast";

type LabelNode = { label?: string };
type ImageNode = LabelNode & { attributes?: { height?: string } };

type TopPodcastEntry = {
  id?: { attributes?: { "im:id"?: string }; label?: string };
  "im:name"?: LabelNode;
  "im:artist"?: LabelNode;
  "im:image"?: ImageNode[];
  summary?: LabelNode;
};

export type TopPodcastsFeed = {
  feed?: {
    entry?: TopPodcastEntry | TopPodcastEntry[];
  };
};

type LookupResult = {
  wrapperType?: string;
  kind?: string;
  collectionId?: number;
  collectionName?: string;
  trackName?: string;
  artistName?: string;
  description?: string;
  shortDescription?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  trackId?: number;
  releaseDate?: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
  previewUrl?: string;
};

export type LookupResponse = {
  results?: LookupResult[];
};

function asEntries(
  entry: TopPodcastEntry | TopPodcastEntry[] | undefined,
): TopPodcastEntry[] {
  if (!entry) {
    return [];
  }
  return Array.isArray(entry) ? entry : [entry];
}

function pickImagesFromFeed(images: ImageNode[] | undefined): PodcastImages {
  const byHeight = new Map<number, string>();
  for (const image of images ?? []) {
    const height = Number(image.attributes?.height);
    const url = image.label?.trim() ?? "";
    if (url && Number.isFinite(height)) {
      byHeight.set(height, url);
    }
  }

  const small =
    byHeight.get(55) ?? byHeight.get(60) ?? [...byHeight.values()][0] ?? "";
  const medium =
    byHeight.get(170) ?? byHeight.get(100) ?? byHeight.get(60) ?? small;
  const large =
    byHeight.get(600) ??
    [...byHeight.entries()].sort((a, b) => b[0] - a[0])[0]?.[1] ??
    medium;

  return { small, medium, large };
}

function pickImagesFromLookup(result: LookupResult): PodcastImages {
  const small = result.artworkUrl60 ?? result.artworkUrl100 ?? "";
  const medium = result.artworkUrl100 ?? result.artworkUrl60 ?? "";
  const large =
    result.artworkUrl600 ?? result.artworkUrl100 ?? result.artworkUrl60 ?? "";
  return { small, medium, large };
}

export function mapTopPodcasts(payload: TopPodcastsFeed): Podcast[] {
  return asEntries(payload.feed?.entry)
    .map((entry) => {
      const id = entry.id?.attributes?.["im:id"]?.trim() ?? "";
      const title = entry["im:name"]?.label?.trim() ?? "";
      const author = entry["im:artist"]?.label?.trim() ?? "";
      if (!id || !title || !author) {
        return null;
      }

      return new Podcast(
        id,
        title,
        author,
        pickImagesFromFeed(entry["im:image"]),
        entry.summary?.label?.trim() ?? "",
      );
    })
    .filter((podcast): podcast is Podcast => podcast !== null);
}

export function mapPodcastDetail(
  payload: LookupResponse,
  podcastId: string,
): { podcast: Podcast; episodes: Episode[] } {
  const results = payload.results ?? [];
  const collection =
    results.find(
      (item) =>
        item.wrapperType === "track" ||
        item.kind === "podcast" ||
        (item.collectionId !== undefined && !item.trackId),
    ) ?? results[0];

  if (!collection) {
    throw new Error(`Podcast detail not found for id ${podcastId}`);
  }

  const id = String(collection.collectionId ?? podcastId);
  const title = collection.collectionName?.trim() ?? "";
  const author = collection.artistName?.trim() ?? "";
  if (!title || !author) {
    throw new Error(`Podcast detail incomplete for id ${podcastId}`);
  }

  const podcast = new Podcast(
    id,
    title,
    author,
    pickImagesFromLookup(collection),
    (
      collection.description ??
      collection.shortDescription ??
      ""
    ).trim(),
  );

  const episodes = results
    .filter(
      (item) =>
        item.kind === "podcastEpisode" || item.wrapperType === "podcastEpisode",
    )
    .map((item) => {
      const episodeId = item.trackId !== undefined ? String(item.trackId) : "";
      const episodeTitle = item.trackName?.trim() ?? "";
      const publishedAt = new Date(item.releaseDate ?? "");
      const durationMs = item.trackTimeMillis ?? 0;
      const audioUrl = item.episodeUrl ?? item.previewUrl ?? "";
      const description = item.description ?? item.shortDescription ?? "";

      if (!episodeId || !episodeTitle || Number.isNaN(publishedAt.getTime())) {
        return null;
      }

      return new Episode(
        episodeId,
        id,
        episodeTitle,
        description,
        publishedAt,
        durationMs,
        audioUrl,
      );
    })
    .filter((episode): episode is Episode => episode !== null);

  return { podcast, episodes };
}
