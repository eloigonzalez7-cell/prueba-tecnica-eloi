import { useLayoutEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
        <Link className={styles.brand} to="/">
          Podcaster
        </Link>
        {isLoading ? (
          <output className={styles.loading} aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            Loading
          </output>
        ) : null}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
