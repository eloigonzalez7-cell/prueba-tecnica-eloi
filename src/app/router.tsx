import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/app/AppLayout";

const HomePage = lazy(() =>
  import("@/features/podcasts/ui/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);
const PodcastDetailPage = lazy(() =>
  import("@/features/podcasts/ui/PodcastDetailPage").then((module) => ({
    default: module.PodcastDetailPage,
  })),
);
const EpisodeDetailPage = lazy(() =>
  import("@/features/podcasts/ui/EpisodeDetailPage").then((module) => ({
    default: module.EpisodeDetailPage,
  })),
);

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="podcast/:podcastId" element={<PodcastDetailPage />} />
          <Route
            path="podcast/:podcastId/episode/:episodeId"
            element={<EpisodeDetailPage />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
