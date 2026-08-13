import { Link } from "react-router-dom";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import styles from "@/features/podcasts/ui/HomePage.module.css";

type PodcastCardProps = {
  readonly podcast: Podcast;
};

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
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
          podcast.images.medium ? `${podcast.images.medium} 170w` : "",
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
  );
}
