import { Link, Outlet } from "react-router-dom";
import styles from "@/app/AppLayout.module.css";

export function AppLayout() {
  return (
    <>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          Podcaster
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
