import { Link } from "react-router-dom";
import type { Episode } from "@/features/podcasts/domain/Episode";
import {
  formatEpisodeDate,
  formatEpisodeDuration,
} from "@/features/podcasts/ui/formatEpisodeMeta";
import styles from "@/features/podcasts/ui/EpisodesTable.module.css";

type EpisodesTableProps = {
  readonly episodes: readonly Episode[];
};

export function EpisodesTable({ episodes }: EpisodesTableProps) {
  return (
    <section className={styles.panel} aria-labelledby="episodes-heading">
      <header className={styles.header}>
        <h2 id="episodes-heading" className={styles.title}>
          Episodes
        </h2>
        <output className={styles.count} aria-label="Episode count">
          {episodes.length}
        </output>
      </header>

      {episodes.length === 0 ? (
        <p className={styles.empty}>No episodes available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.id}>
                <td>
                  <Link
                    className={styles.titleLink}
                    to={`/podcast/${episode.podcastId}/episode/${episode.id}`}
                  >
                    {episode.title}
                  </Link>
                </td>
                <td>
                  <time dateTime={episode.publishedAt.toISOString()}>
                    {formatEpisodeDate(episode.publishedAt)}
                  </time>
                </td>
                <td>
                  <time dateTime={`PT${Math.floor(episode.durationMs / 1000)}S`}>
                    {formatEpisodeDuration(episode.durationMs)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
