import styles from "./App.module.css";

export function App() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <h1 className={styles.title}>Podcaster</h1>
        <p className={styles.subtitle}>App shell ready.</p>
      </main>
    </div>
  );
}
