import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Podcast } from "../domain/Podcast";
import styles from "./HomePage.module.css";
import { getTopPodcasts } from "./podcastDependencies";

export function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      setLoading(true);
      try {
        const result = await getTopPodcasts.execute(controller.signal);
        if (!controller.signal.aborted) {
          setPodcasts(result);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Podcaster</h1>

      {loading ? (
        <>
          <p className={styles.status}>Loading podcasts…</p>
          <div className={styles.skeletonGrid} aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonCover} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className={styles.status}>{podcasts.length} podcasts</p>
          <ul className={styles.grid}>
            {podcasts.map((podcast) => (
              <li key={podcast.id}>
                <Link
                  className={styles.card}
                  to={`/podcast/${podcast.id}`}
                  aria-label={`${podcast.title} by ${podcast.author}`}
                >
                  <img
                    className={styles.cover}
                    src={podcast.images.medium || podcast.images.large}
                    srcSet={[
                      podcast.images.small
                        ? `${podcast.images.small} 60w`
                        : "",
                      podcast.images.medium
                        ? `${podcast.images.medium} 170w`
                        : "",
                      podcast.images.large
                        ? `${podcast.images.large} 600w`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    sizes="120px"
                    alt={podcast.title}
                    loading="lazy"
                    width={120}
                    height={120}
                  />
                  <p className={styles.name}>{podcast.title}</p>
                  <p className={styles.author}>{podcast.author}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
