import { useEffect, useRef, useState } from "react";
import type { Podcast } from "@/features/podcasts/domain/Podcast";
import { PodcastCard } from "@/features/podcasts/ui/PodcastCard";
import styles from "@/features/podcasts/ui/HomePage.module.css";

/** Matches HomePage.module.css: card min-height 160 + row-gap 88. */
export const GRID_ROW_HEIGHT_PX = 248;
const COVER_OFFSET_PX = 50;
const OVERSCAN_ROWS = 2;

export function columnsForViewportWidth(width: number): number {
  if (width <= 480) {
    return 1;
  }
  if (width <= 720) {
    return 2;
  }
  if (width <= 980) {
    return 3;
  }
  return 4;
}

type VirtualizedPodcastGridProps = {
  readonly podcasts: readonly Podcast[];
};

type Viewport = {
  readonly width: number;
  readonly height: number;
  readonly gridTop: number;
};

function visibleRowRange(
  itemCount: number,
  columns: number,
  gridTop: number,
  viewportHeight: number,
): { startRow: number; endRow: number; rowCount: number } {
  const rowCount = Math.max(1, Math.ceil(itemCount / columns) || 1);
  const scrolledIntoGrid = Math.max(0, -gridTop);
  const startRow = Math.max(
    0,
    Math.floor(scrolledIntoGrid / GRID_ROW_HEIGHT_PX) - OVERSCAN_ROWS,
  );
  const visibleRows =
    Math.ceil(viewportHeight / GRID_ROW_HEIGHT_PX) + OVERSCAN_ROWS * 2;
  const endRow = Math.min(rowCount, startRow + visibleRows);
  return { startRow, endRow, rowCount };
}

/**
 * Windowed home grid: only mounts cards near the viewport so page size 100
 * does not create 100 image nodes.
 */
export function VirtualizedPodcastGrid({ podcasts }: VirtualizedPodcastGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [viewport, setViewport] = useState<Viewport>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    gridTop: 0,
  }));

  useEffect(() => {
    const syncFromWindow = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        gridTop: listRef.current?.getBoundingClientRect().top ?? 0,
      });
    };

    window.addEventListener("scroll", syncFromWindow, { passive: true });
    window.addEventListener("resize", syncFromWindow);
    return () => {
      window.removeEventListener("scroll", syncFromWindow);
      window.removeEventListener("resize", syncFromWindow);
    };
  }, []);

  const columns = columnsForViewportWidth(viewport.width);
  const range = visibleRowRange(
    podcasts.length,
    columns,
    viewport.gridTop,
    viewport.height,
  );
  const startIndex = range.startRow * columns;
  const endIndex = Math.min(podcasts.length, range.endRow * columns);
  const visible = podcasts.slice(startIndex, endIndex);
  const paddingTop = COVER_OFFSET_PX + range.startRow * GRID_ROW_HEIGHT_PX;
  const paddingBottom = Math.max(
    0,
    (range.rowCount - range.endRow) * GRID_ROW_HEIGHT_PX,
  );

  return (
    <ul
      ref={listRef}
      className={styles.grid}
      aria-label="Podcast list"
      style={{ paddingTop, paddingBottom }}
    >
      {visible.map((podcast) => (
        <li key={podcast.id}>
          <PodcastCard podcast={podcast} />
        </li>
      ))}
    </ul>
  );
}
