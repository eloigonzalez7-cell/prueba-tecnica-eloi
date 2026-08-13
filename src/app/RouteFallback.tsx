import { DetailSkeleton } from "@/features/podcasts/ui/DetailSkeleton";
import styles from "@/features/podcasts/ui/PodcastDetailPage.module.css";

/**
 * Suspense fallback while a lazy page chunk loads. Reuses the detail skeleton
 * so cold navigations never flash an empty main or a premature not-found.
 */
export function RouteFallback() {
  return (
    <section className={styles.page} aria-busy="true">
      <DetailSkeleton label="Loading…" />
    </section>
  );
}
