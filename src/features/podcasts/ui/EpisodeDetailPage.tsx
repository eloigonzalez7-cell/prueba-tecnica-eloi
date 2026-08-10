import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import type { Episode } from "@/features/podcasts/domain/Episode";
import type { PodcastDetail } from "@/features/podcasts/domain/PodcastRepository";
import { getPodcastDetail } from "@/features/podcasts/ui/podcastDependencies";
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
  useSyncAppLoading(loading);

  useEffect(() => {
    if (!podcastId) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      setLoading(true);
      try {
        const result = await getPodcastDetail.execute(
          podcastId,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setDetail(result);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error(error);
        setDetail(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [podcastId]);

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
      {loading ? (
        <>
          <p className={layoutStyles.srOnly}>Loading episode…</p>
          <aside className={layoutStyles.sidebarSkeleton} aria-hidden="true">
            <span className={layoutStyles.skeletonCover} />
            <span className={layoutStyles.skeletonLine} />
            <span className={layoutStyles.skeletonLineShort} />
            <span className={layoutStyles.skeletonBlock} />
          </aside>
          <section className={layoutStyles.contentSkeleton} aria-hidden="true">
            <span className={layoutStyles.skeletonHeader} />
            <span className={layoutStyles.skeletonBlock} />
            <span className={layoutStyles.skeletonRow} />
          </section>
        </>
      ) : null}

      {!loading && (!detail || !episode) ? (
        <p className={layoutStyles.status}>Episode not found.</p>
      ) : null}

      {!loading && detail && episode ? (
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
