function topPodcastsFeed(count: number) {
  return {
    feed: {
      entry: Array.from({ length: count }, (_, index) => ({
        id: { attributes: { "im:id": String(2000 + index) } },
        "im:name": { label: `Show ${index + 1}` },
        "im:artist": { label: `Author ${index + 1}` },
        "im:image": [
          {
            label: "https://example.com/55.jpg",
            attributes: { height: "55" },
          },
          {
            label: "https://example.com/60.jpg",
            attributes: { height: "60" },
          },
          {
            label: "https://example.com/170.jpg",
            attributes: { height: "170" },
          },
        ],
        summary: { label: `Summary ${index + 1}` },
      })),
    },
  };
}

describe("Home pagination", () => {
  it("changes page size and moves between pages", () => {
    cy.intercept("GET", /toppodcasts/, topPodcastsFeed(12)).as("topPodcasts");
    cy.intercept("GET", /lookup/, { fixture: "podcastLookup.json" }).as(
      "podcastLookup",
    );
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.contains("output", "12").should("be.visible");
    cy.get("#page-size").should("have.value", "25");
    cy.contains("Page 1 of 1").should("be.visible");

    cy.get("#page-size").select("10");
    cy.contains("Page 1 of 2").should("be.visible");
    cy.contains("a", "Show 1").should("be.visible");
    cy.contains("a", "Show 11").should("not.exist");

    cy.contains("button", "Next").click();
    cy.contains("Page 2 of 2").should("be.visible");
    cy.contains("a", "Show 11").should("be.visible");
    cy.contains("a", "Show 1").should("not.exist");
  });
});
