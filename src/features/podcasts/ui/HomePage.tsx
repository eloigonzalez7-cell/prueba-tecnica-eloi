import { useEffect, useState } from "react";
import { useSyncAppLoading } from "@/app/loading/AppLoadingContext";
import {
  filterPodcasts,
  getTopPodcasts,
  paginatePodcasts,
} from "@/app/podcastDependencies";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import { VirtualizedPodcastGrid } from "@/features/podcasts/ui/VirtualizedPodcastGrid";
import styles from "@/features/podcasts/ui/HomePage.module.css";

const PAGE_SIZES = [10, 25, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 25;

export function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(
    DEFAULT_PAGE_SIZE,
  );
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
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [reloadToken]);

  const filteredPodcasts = filterPodcasts.execute(podcasts, query);
  const paged = paginatePodcasts.execute(filteredPodcasts, page, pageSize);

  return (
    <section className={styles.page}>
      <h1 className={styles.srOnly}>Top podcasts</h1>

      <header className={styles.toolbar}>
        <output
          className={styles.badge}
          htmlFor="podcast-filter"
          aria-live="polite"
        >
          {loading ? "…" : paged.total}
        </output>
        <label className={styles.srOnly} htmlFor="podcast-filter">
          Filter podcasts
        </label>
        <input
          id="podcast-filter"
          className={styles.filter}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Filter podcasts..."
          disabled={loading}
        />
        <label className={styles.pageSizeLabel} htmlFor="page-size">
          Per page
        </label>
        <select
          id="page-size"
          className={styles.pageSize}
          value={pageSize}
          disabled={loading}
          onChange={(event) => {
            setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number]);
            setPage(1);
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
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
        <>
          <VirtualizedPodcastGrid podcasts={paged.items} />

          <nav className={styles.pager} aria-label="Podcast list pages">
            <button
              type="button"
              className={styles.pagerButton}
              disabled={paged.page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <p className={styles.pagerStatus} aria-live="polite">
              Page {paged.page} of {paged.pageCount}
            </p>
            <button
              type="button"
              className={styles.pagerButton}
              disabled={paged.page >= paged.pageCount}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </nav>
        </>
      ) : null}
    </section>
  );
}
