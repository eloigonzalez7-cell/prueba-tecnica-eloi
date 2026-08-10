import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppLoadingProvider } from "@/app/loading/AppLoadingContext";
import { Episode } from "@/features/podcasts/domain/Episode";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import type { PodcastDetail } from "@/features/podcasts/domain/PodcastRepository";
import { PodcastDetailPage } from "@/features/podcasts/ui/PodcastDetailPage";

const mockGetPodcastDetailExecute = jest.fn();

jest.mock("@/app/podcastDependencies", () => ({
  getPodcastDetail: {
    execute: (...args: unknown[]) => mockGetPodcastDetailExecute(...args),
  },
}));

function detailFixture(): PodcastDetail {
  const podcast = new Podcast(
    "1535809341",
    "The Joe Budden Podcast",
    "The Joe Budden Network",
    {
      small: "https://example.com/s.jpg",
      medium: "https://example.com/m.jpg",
      large: "https://example.com/l.jpg",
    },
    "Weekly talk show",
  );

  return {
    podcast,
    episodes: [
      new Episode(
        "1000601234567",
        podcast.id,
        "Episode 700",
        "Show notes",
        new Date("2024-01-15T10:00:00.000Z"),
        3_600_000,
        "https://example.com/audio.mp3",
      ),
    ],
  };
}

function renderDetailPage(path = "/podcast/1535809341") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppLoadingProvider>
        <Routes>
          <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
        </Routes>
      </AppLoadingProvider>
    </MemoryRouter>,
  );
}

describe("PodcastDetailPage", () => {
  beforeEach(() => {
    mockGetPodcastDetailExecute.mockReset();
  });

  it("renders sidebar and episodes for a podcast", async () => {
    mockGetPodcastDetailExecute.mockResolvedValue(detailFixture());

    renderDetailPage();

    expect(
      await screen.findByRole("complementary", { name: "Podcast summary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The Joe Budden Podcast" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Episode count")).toHaveTextContent("1");
    expect(
      screen.getByRole("link", { name: "Episode 700" }),
    ).toHaveAttribute(
      "href",
      "/podcast/1535809341/episode/1000601234567",
    );
    expect(mockGetPodcastDetailExecute).toHaveBeenCalledWith(
      "1535809341",
      expect.any(AbortSignal),
    );
  });

  it("shows an error banner with retry when loading fails", async () => {
    mockGetPodcastDetailExecute
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(detailFixture());

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    renderDetailPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Could not load this podcast/i,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("link", { name: "Episode 700" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    consoleError.mockRestore();
  });
});
