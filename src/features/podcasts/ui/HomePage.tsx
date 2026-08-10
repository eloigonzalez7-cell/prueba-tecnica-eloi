import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import { filterPodcasts, getTopPodcasts } from "@/features/podcasts/ui/podcastDependencies";
import styles from "@/features/podcasts/ui/HomePage.module.css";

export function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [query, setQuery] = useState("");
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

  const visiblePodcasts = filterPodcasts.execute(podcasts, query);

  return (
    <section className={styles.page}>
      <header className={styles.toolbar}>
        <h1 className={styles.title}>Podcaster</h1>
        <form
          className={styles.searchForm}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={styles.filterLabel} htmlFor="podcast-filter">
            Filter podcasts by title or author
          </label>
          <input
            id="podcast-filter"
            className={styles.filterInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by title or author"
            disabled={loading}
          />
          <output className={styles.badge} htmlFor="podcast-filter">
            {loading ? "…" : visiblePodcasts.length}
          </output>
        </form>
      </header>

      {loading ? (
        <>
          <p className={styles.status}>Loading podcasts…</p>
          <ul className={styles.skeletonGrid} aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <li key={index} className={styles.skeletonCard}>
                <span className={styles.skeletonCover} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonLine} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className={styles.status}>
            {visiblePodcasts.length} of {podcasts.length} podcasts
          </p>
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
                  <h2 className={styles.name}>{podcast.title}</h2>
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
