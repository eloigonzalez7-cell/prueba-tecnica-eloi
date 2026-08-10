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
