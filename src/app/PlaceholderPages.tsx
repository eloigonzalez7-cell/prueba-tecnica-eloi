import { Link, useParams } from "react-router-dom";

export function PodcastPlaceholder() {
  const { podcastId } = useParams<{ podcastId: string }>();

  return (
    <section>
      <h1>Podcast detail</h1>
      <p>Podcast ID: {podcastId}</p>
      <nav>
        <p>
          <Link to={`/podcast/${podcastId}/episode/456`}>
            Open sample episode
          </Link>
        </p>
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </nav>
    </section>
  );
}

export function EpisodePlaceholder() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();

  return (
    <section>
      <h1>Episode detail</h1>
      <p>Podcast ID: {podcastId}</p>
      <p>Episode ID: {episodeId}</p>
      <nav>
        <p>
          <Link to={`/podcast/${podcastId}`}>Back to podcast</Link>
        </p>
      </nav>
    </section>
  );
}
