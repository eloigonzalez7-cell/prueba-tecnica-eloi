import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppLayout } from "@/app/AppLayout";
import {
  AppLoadingProvider,
  useAppLoading,
} from "@/app/loading/AppLoadingContext";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import { HomePage } from "@/features/podcasts/ui/HomePage";

const mockGetTopPodcastsExecute = jest.fn();

jest.mock("@/app/podcastDependencies", () => {
  const { FilterPodcasts } = jest.requireActual(
    "@/features/podcasts/application/FilterPodcasts",
  ) as typeof import("@/features/podcasts/application/FilterPodcasts");
  const { PaginatePodcasts } = jest.requireActual(
    "@/features/podcasts/application/PaginatePodcasts",
  ) as typeof import("@/features/podcasts/application/PaginatePodcasts");

  return {
    getTopPodcasts: {
      execute: (...args: unknown[]) => mockGetTopPodcastsExecute(...args),
    },
    filterPodcasts: new FilterPodcasts(),
    paginatePodcasts: new PaginatePodcasts(),
  };
});

function HeaderLoadingProbe() {
  const { isLoading } = useAppLoading();
  return (
    <span data-testid="loading-flag">{isLoading ? "loading" : "idle"}</span>
  );
}

function podcast(id: string, title: string, author: string): Podcast {
  return new Podcast(
    id,
    title,
    author,
    {
      small: "https://example.com/s.jpg",
      medium: "https://example.com/m.jpg",
      large: "https://example.com/l.jpg",
    },
    "Description",
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    mockGetTopPodcastsExecute.mockReset();
  });

  it("renders podcasts and filters by title", async () => {
    mockGetTopPodcastsExecute.mockResolvedValue([
      podcast("1", "The Joe Budden Podcast", "The Joe Budden Network"),
      podcast("2", "Song Exploder", "Hrishikesh Hirway"),
    ]);

    render(
      <MemoryRouter>
        <AppLoadingProvider>
          <HomePage />
        </AppLoadingProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("link", {
        name: "The Joe Budden Podcast by The Joe Budden Network",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Song Exploder by Hrishikesh Hirway",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2");

    fireEvent.change(screen.getByLabelText("Filter podcasts"), {
      target: { value: "song" },
    });

    expect(screen.getByRole("status")).toHaveTextContent("1");
    expect(
      screen.getByRole("link", {
        name: "Song Exploder by Hrishikesh Hirway",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "The Joe Budden Podcast by The Joe Budden Network",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows an error banner with retry when loading fails", async () => {
    mockGetTopPodcastsExecute
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce([
        podcast("1", "The Joe Budden Podcast", "The Joe Budden Network"),
      ]);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(
      <MemoryRouter>
        <AppLoadingProvider>
          <HomePage />
        </AppLoadingProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Could not load podcasts/i,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("link", {
        name: "The Joe Budden Podcast by The Joe Budden Network",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("pages the filtered list from the application use case", async () => {
    mockGetTopPodcastsExecute.mockResolvedValue(
      Array.from({ length: 12 }, (_, index) =>
        podcast(String(index + 1), `Show ${index + 1}`, `Author ${index + 1}`),
      ),
    );

    render(
      <MemoryRouter>
        <AppLoadingProvider>
          <HomePage />
        </AppLoadingProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("status")).toHaveTextContent("12");
    expect(screen.getByLabelText("Per page")).toHaveValue("25");
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Per page"), {
      target: { value: "10" },
    });

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Show 1 by Author 1" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Show 11 by Author 11" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Show 11 by Author 11" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Show 1 by Author 1" }),
    ).not.toBeInTheDocument();
  });
});

describe("AppLayout loading cue", () => {
  it("syncs the header loading flag from page state", async () => {
    let resolveLoad!: (value: Podcast[]) => void;
    mockGetTopPodcastsExecute.mockImplementation(
      () =>
        new Promise<Podcast[]>((resolve) => {
          resolveLoad = resolve;
        }),
    );

    render(
      <MemoryRouter>
        <AppLoadingProvider>
          <HeaderLoadingProbe />
          <AppLayout />
          <HomePage />
        </AppLoadingProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-flag")).toHaveTextContent("loading");
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();

    resolveLoad([podcast("1", "Alpha Show", "Alpha Author")]);

    await waitFor(() => {
      expect(screen.getByTestId("loading-flag")).toHaveTextContent("idle");
    });
    expect(screen.queryByLabelText("Loading")).not.toBeInTheDocument();
  });
});
