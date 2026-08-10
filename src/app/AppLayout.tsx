import { Outlet } from "react-router-dom";
import styles from "@/app/AppLayout.module.css";

export function AppLayout() {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  );
}
