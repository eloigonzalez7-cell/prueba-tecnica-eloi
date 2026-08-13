import styles from "@/features/podcasts/ui/PodcastDetailPage.module.css";

type DetailSkeletonProps = {
  readonly label: string;
};

/**
 * Placeholder layout for podcast/episode pages while lookup is in flight.
 */
export function DetailSkeleton({ label }: DetailSkeletonProps) {
  return (
    <>
      <p className={styles.srOnly}>{label}</p>
      <aside className={styles.sidebarSkeleton} aria-hidden="true">
        <span className={styles.skeletonCover} />
        <span className={styles.skeletonLine} />
        <span className={styles.skeletonLineShort} />
        <span className={styles.skeletonBlock} />
      </aside>
      <section className={styles.contentSkeleton} aria-hidden="true">
        <span className={styles.skeletonHeader} />
        <span className={styles.skeletonRow} />
        <span className={styles.skeletonRow} />
        <span className={styles.skeletonRow} />
        <span className={styles.skeletonRow} />
      </section>
    </>
  );
}
