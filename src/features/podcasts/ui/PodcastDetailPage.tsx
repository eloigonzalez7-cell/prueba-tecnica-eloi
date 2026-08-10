import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import { getPodcastDetail } from "@/app/podcastDependencies";
import type { PodcastDetail } from "@/features/podcasts/domain/PodcastRepository";
import { EpisodesTable } from "@/features/podcasts/ui/EpisodesTable";
import { PodcastSidebar } from "@/features/podcasts/ui/PodcastSidebar";
import styles from "@/features/podcasts/ui/PodcastDetailPage.module.css";

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();
  const [detail, setDetail] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(podcastId));
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
        setError("Could not load this podcast. Check your connection and try again.");
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

  if (!podcastId) {
    return (
      <section className={styles.page}>
        <p className={styles.status}>Podcast not found.</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      {loading ? (
        <>
          <p className={styles.srOnly}>Loading podcast…</p>
          <aside className={styles.sidebarSkeleton} aria-hidden="true">
            <span className={styles.skeletonCover} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
            <span className={styles.skeletonBlock} />
          </aside>
          <section className={styles.contentSkeleton} aria-hidden="true">
            <span className={styles.skeletonHeader} />
            <span className={styles.skeletonRow} />
            <span className={styles.skeletonRow} />
            <span className={styles.skeletonRow} />
            <span className={styles.skeletonRow} />
          </section>
        </>
      ) : null}

      {!loading && error ? (
        <div className={styles.errorBanner} role="alert">
          <p className={styles.errorMessage}>{error}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => setReloadToken((token) => token + 1)}
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && !detail ? (
        <p className={styles.status}>Podcast not found.</p>
      ) : null}

      {!loading && !error && detail ? (
        <>
          <PodcastSidebar podcast={detail.podcast} />
          <EpisodesTable episodes={detail.episodes} />
        </>
      ) : null}
    </section>
  );
}
