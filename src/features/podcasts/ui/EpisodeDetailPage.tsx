import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import { getPodcastDetail } from "@/app/podcastDependencies";
import type { Episode } from "@/features/podcasts/domain/Episode";
import type { PodcastDetail } from "@/features/podcasts/domain/PodcastRepository";
import { DetailSkeleton } from "@/features/podcasts/ui/DetailSkeleton";
import { PodcastSidebar } from "@/features/podcasts/ui/PodcastSidebar";
import { sanitizeHtml } from "@/shared/html/sanitizeHtml";
import layoutStyles from "@/features/podcasts/ui/PodcastDetailPage.module.css";
import styles from "@/features/podcasts/ui/EpisodeDetailPage.module.css";

export function EpisodeDetailPage() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();
  const [detail, setDetail] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(podcastId && episodeId));
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  useSyncAppLoading(loading);

  useEffect(() => {
    if (!podcastId) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPodcastDetail.execute(
          podcastId,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setDetail(result);
        }
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        console.error(loadError);
        setDetail(null);
        setError("Could not load this episode. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [podcastId, reloadToken]);

  if (!podcastId || !episodeId) {
    return (
      <section className={layoutStyles.page}>
        <p className={layoutStyles.status}>Episode not found.</p>
      </section>
    );
  }

  const episode = findEpisode(detail, episodeId);

  return (
    <section className={layoutStyles.page}>
      {loading ? <DetailSkeleton label="Loading episode…" /> : null}

      {!loading && error ? (
        <div className={layoutStyles.errorBanner} role="alert">
          <p className={layoutStyles.errorMessage}>{error}</p>
          <button
            type="button"
            className={layoutStyles.retryButton}
            onClick={() => setReloadToken((token) => token + 1)}
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && (!detail || !episode) ? (
        <p className={layoutStyles.status}>Episode not found.</p>
      ) : null}

      {!loading && !error && detail && episode ? (
        <>
          <PodcastSidebar podcast={detail.podcast} />
          <article className={styles.panel} aria-labelledby="episode-title">
            <header className={styles.header}>
              <h1 id="episode-title" className={styles.title}>
                {episode.title}
              </h1>
            </header>

            {episode.description.trim() ? (
              <section
                className={styles.description}
                aria-label="Episode description"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(episode.description),
                }}
              />
            ) : null}

            <audio
              className={styles.audio}
              controls
              preload="metadata"
              src={episode.audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </article>
        </>
      ) : null}
    </section>
  );
}

function findEpisode(
  detail: PodcastDetail | null,
  episodeId: string,
): Episode | null {
  if (!detail) {
    return null;
  }

  return detail.episodes.find((item) => item.id === episodeId) ?? null;
}
