import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import {
  EpisodePlaceholder,
  HomePlaceholder,
  PodcastPlaceholder,
} from "./PlaceholderPages";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePlaceholder />} />
        <Route path="podcast/:podcastId" element={<PodcastPlaceholder />} />
        <Route
          path="podcast/:podcastId/episode/:episodeId"
          element={<EpisodePlaceholder />}
        />
      </Route>
    </Routes>
  );
}
