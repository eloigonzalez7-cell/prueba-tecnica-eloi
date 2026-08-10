import { Link } from "react-router-dom";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import styles from "@/features/podcasts/ui/PodcastSidebar.module.css";

type PodcastSidebarProps = {
  readonly podcast: Podcast;
};

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reusable podcast summary panel (detail + episode views).
 */
export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  const cover = podcast.images.medium || podcast.images.large;
  const description = toPlainText(podcast.description);
  const podcastPath = `/podcast/${podcast.id}`;

  return (
    <aside className={styles.sidebar} aria-label="Podcast summary">
      <Link className={styles.coverLink} to={podcastPath}>
        <img
          className={styles.cover}
          src={cover}
          srcSet={[
            podcast.images.small ? `${podcast.images.small} 60w` : "",
            podcast.images.medium ? `${podcast.images.medium} 170w` : "",
            podcast.images.large ? `${podcast.images.large} 600w` : "",
          ]
            .filter(Boolean)
            .join(", ")}
          sizes="170px"
          alt={podcast.title}
          width={170}
          height={170}
        />
      </Link>

      <header className={styles.header}>
        <h2 className={styles.title}>
          <Link to={podcastPath}>{podcast.title}</Link>
        </h2>
        <p className={styles.author}>by {podcast.author}</p>
      </header>

      {description ? (
        <section className={styles.description} aria-labelledby="podcast-description-heading">
          <h3 id="podcast-description-heading" className={styles.descriptionHeading}>
            Description
          </h3>
          <p className={styles.descriptionText}>{description}</p>
        </section>
      ) : null}
    </aside>
  );
}
