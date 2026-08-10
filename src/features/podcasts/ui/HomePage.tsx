import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import {
  filterPodcasts,
  getTopPodcasts,
} from "@/features/podcasts/ui/podcastDependencies";
import styles from "@/features/podcasts/ui/HomePage.module.css";

export function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useSyncAppLoading(loading);

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

  const visiblePodcasts = filterPodcasts.execute(podcasts, query);

  return (
    <section className={styles.page}>
      <h1 className={styles.srOnly}>Top podcasts</h1>

      <header className={styles.toolbar}>
        <output
          className={styles.badge}
          htmlFor="podcast-filter"
          aria-live="polite"
        >
          {loading ? "…" : visiblePodcasts.length}
        </output>
        <label className={styles.srOnly} htmlFor="podcast-filter">
          Filter podcasts
        </label>
        <input
          id="podcast-filter"
          className={styles.filter}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter podcasts..."
          disabled={loading}
        />
      </header>

      {loading ? (
        <ul className={styles.grid} aria-busy="true" aria-label="Loading podcasts">
          {Array.from({ length: 8 }, (_, index) => (
            <li key={index} className={styles.skeletonCard} aria-hidden="true">
              <span className={styles.skeletonCover} />
              <span className={styles.skeletonLine} />
              <span className={styles.skeletonLineShort} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.grid}>
          {visiblePodcasts.map((podcast) => (
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
                    podcast.images.small ? `${podcast.images.small} 60w` : "",
                    podcast.images.medium
                      ? `${podcast.images.medium} 170w`
                      : "",
                    podcast.images.large ? `${podcast.images.large} 600w` : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  sizes="100px"
                  alt=""
                  loading="lazy"
                  width={100}
                  height={100}
                />
                <h2 className={styles.title}>{podcast.title}</h2>
                <p className={styles.author}>{podcast.author}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
