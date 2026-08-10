import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import {
  filterPodcasts,
  getTopPodcasts,
} from "@/app/podcastDependencies";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import styles from "@/features/podcasts/ui/HomePage.module.css";

export function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  useSyncAppLoading(loading);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getTopPodcasts.execute(controller.signal);
        if (!controller.signal.aborted) {
          setPodcasts(result);
        }
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        console.error(loadError);
        setPodcasts([]);
        setError("Could not load podcasts. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [reloadToken]);

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

      {error ? (
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
      ) : null}

      {!loading && !error ? (
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
      ) : null}
    </section>
  );
}
