import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Podcast } from "@/features/podcasts/domain/Podcast";
import { PodcastSidebar } from "@/features/podcasts/ui/PodcastSidebar";

function renderSidebar(podcast: Podcast) {
  return render(
    <MemoryRouter>
      <PodcastSidebar podcast={podcast} />
    </MemoryRouter>,
  );
}

describe("PodcastSidebar", () => {
  it("linkifies bare URLs in the podcast description", () => {
    const podcast = new Podcast(
      "1535809341",
      "The Joe Budden Podcast",
      "The Joe Budden Network",
      {
        small: "https://example.com/s.jpg",
        medium: "https://example.com/m.jpg",
        large: "https://example.com/l.jpg",
      },
      "Tune in weekly. More at https://example.com/show and omnystudio.com/listener",
    );

    renderSidebar(podcast);

    expect(
      screen.getByRole("link", { name: "https://example.com/show" }),
    ).toHaveAttribute("href", "https://example.com/show");
    expect(
      screen.getByRole("link", { name: "omnystudio.com/listener" }),
    ).toHaveAttribute("href", "https://omnystudio.com/listener");
  });

  it("keeps safe HTML and does not strip existing anchors", () => {
    const podcast = new Podcast(
      "1",
      "Song Exploder",
      "Hrishikesh Hirway",
      {
        small: "https://example.com/s.jpg",
        medium: "https://example.com/m.jpg",
        large: "https://example.com/l.jpg",
      },
      '<p>Listen on <a href="https://songexploder.net">songexploder.net</a></p>',
    );

    renderSidebar(podcast);

    expect(
      screen.getByRole("link", { name: "songexploder.net" }),
    ).toHaveAttribute("href", "https://songexploder.net");
  });
});
