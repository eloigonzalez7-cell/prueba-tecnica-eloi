import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/app/AppLayout";
import { EpisodeDetailPage } from "@/features/podcasts/ui/EpisodeDetailPage";
import { HomePage } from "@/features/podcasts/ui/HomePage";
import { PodcastDetailPage } from "@/features/podcasts/ui/PodcastDetailPage";

export function AppRouter() {
  return (
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
  );
}
