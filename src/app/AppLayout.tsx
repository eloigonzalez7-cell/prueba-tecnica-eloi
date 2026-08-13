import { Suspense, useLayoutEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { RouteFallback } from "@/app/RouteFallback";
import { useAppLoading } from "@/app/loading/AppLoadingContext";
import styles from "@/app/AppLayout.module.css";

export function AppLayout() {
  const location = useLocation();
  const { isLoading, setLoading } = useAppLoading();

  useLayoutEffect(() => {
    setLoading(true);
  }, [location.key, setLoading]);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.inner} aria-label="Primary">
          <Link className={styles.brand} to="/">
            Podcaster
          </Link>
          {isLoading ? (
            <output className={styles.loading} aria-live="polite" aria-label="Loading">
              <span className={styles.spinner} aria-hidden="true" />
            </output>
          ) : null}
        </nav>
      </header>
      <main className={styles.main}>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
