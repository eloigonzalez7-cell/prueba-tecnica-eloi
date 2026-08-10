import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/features/podcasts/ui/HomePage";
import { AppLayout } from "@/app/AppLayout";
import {
  EpisodePlaceholder,
  PodcastPlaceholder,
} from "@/app/PlaceholderPages";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="podcast/:podcastId" element={<PodcastPlaceholder />} />
        <Route
          path="podcast/:podcastId/episode/:episodeId"
          element={<EpisodePlaceholder />}
        />
      </Route>
    </Routes>
  );
}
