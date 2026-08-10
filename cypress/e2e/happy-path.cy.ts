describe("Podcaster happy path", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();

    // Dev uses /itunes-proxy; prod uses AllOrigins (URL still contains these tokens).
    cy.intercept("GET", /toppodcasts/, {
      fixture: "topPodcasts.json",
    }).as("topPodcasts");

    cy.intercept("GET", /lookup/, {
      fixture: "podcastLookup.json",
    }).as("podcastLookup");
  });

  it("filters podcasts by title while typing", () => {
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.get("#podcast-filter").should("not.be.disabled");
    cy.contains("output", "2").should("be.visible");
    cy.contains("a", "The Joe Budden Podcast").should("be.visible");
    cy.contains("a", "Song Exploder").should("be.visible");

    cy.get("#podcast-filter").type("song");
    cy.contains("output", "1").should("be.visible");
    cy.contains("a", "Song Exploder").should("be.visible");
    cy.contains("a", "The Joe Budden Podcast").should("not.exist");
  });

  it("shows the header loading indicator during navigation", () => {
    cy.intercept("GET", /lookup/, {
      fixture: "podcastLookup.json",
      delay: 600,
    }).as("slowPodcastLookup");

    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.contains("a", "The Joe Budden Podcast").click();
    cy.get('[aria-label="Loading"]').should("be.visible");
    cy.wait("@slowPodcastLookup");
    cy.url().should("include", "/podcast/1535809341");
    cy.get('[aria-label="Loading"]').should("not.exist");
  });

  it("navigates home → podcast detail → episode detail", () => {
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.contains("a", "The Joe Budden Podcast").click();
    cy.wait("@podcastLookup");
    cy.url().should("include", "/podcast/1535809341");
    cy.get("aside").should("contain", "The Joe Budden Podcast");
    cy.get("aside").should("contain", "The Joe Budden Network");
    cy.contains("output", "2").should("be.visible");

    cy.contains("a", "Episode 1").click();
    cy.url().should("include", "/podcast/1535809341/episode/1000000001");
    cy.contains("h1", "Episode 1").should("be.visible");
    cy.get("audio").should("have.attr", "src", "https://example.com/ep1.mp3");
    cy.contains("Hello").should("be.visible");

    cy.get("aside a").contains("The Joe Budden Podcast").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/podcast/1535809341`);
  });
});
