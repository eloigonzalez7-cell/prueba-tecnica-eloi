import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PodcastDetail } from "@/features/podcasts/domain/PodcastRepository";
import { getPodcastDetail } from "@/features/podcasts/ui/podcastDependencies";
import { PodcastSidebar } from "@/features/podcasts/ui/PodcastSidebar";
import styles from "@/features/podcasts/ui/PodcastDetailPage.module.css";

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();
  const [detail, setDetail] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!podcastId) {
    return (
      <section className={styles.page}>
        <p className={styles.status}>Podcast not found.</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      {loading ? <p className={styles.status}>Loading podcast…</p> : null}

      {!loading && !detail ? (
        <p className={styles.status}>Podcast not found.</p>
      ) : null}

      {!loading && detail ? (
        <>
          <PodcastSidebar podcast={detail.podcast} />
          <section
            className={styles.content}
            aria-label={`Episodes for ${detail.podcast.title}`}
          />
        </>
      ) : null}
    </section>
  );
}
