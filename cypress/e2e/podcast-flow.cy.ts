describe("Podcast and episode flow", () => {
  beforeEach(() => {
    cy.stubItunesApis();
  });

  it("navigates home → podcast detail → episode detail", () => {
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.contains("a", "The Joe Budden Podcast").click();
    cy.url().should("include", "/podcast/1535809341");
    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Podcast",
    );
    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Network",
    );
    cy.contains("output", "2").should("be.visible");

    cy.contains("a", "Episode 1").click();
    cy.url().should("include", "/podcast/1535809341/episode/1000000001");
    cy.contains("h1", "Episode 1").should("be.visible");
    cy.get("audio").should("have.attr", "src", "https://example.com/ep1.mp3");
    cy.contains("Hello").should("be.visible");

    cy.get('aside[aria-label="Podcast summary"] a')
      .contains("The Joe Budden Podcast")
      .click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/podcast/1535809341`);
  });

  it("supports a deep link straight to an episode", () => {
    cy.visit("/podcast/1535809341/episode/1000000001");

    cy.url().should(
      "eq",
      `${Cypress.config("baseUrl")}/podcast/1535809341/episode/1000000001`,
    );
    cy.contains("h1", "Episode 1").should("be.visible");
    cy.get("audio").should("have.attr", "src", "https://example.com/ep1.mp3");
    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Podcast",
    );
  });

  it("shows a loading skeleton instead of not-found before cache is warm", () => {
    cy.stubItunesApis({ lookupDelayMs: 800 });
    cy.visit("/podcast/1535809341");

    cy.contains("Podcast not found").should("not.exist");
    cy.contains("Loading podcast").should("exist");
    cy.get("aside[aria-hidden='true']").should("exist");

    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Podcast",
    );
    cy.contains("Podcast not found").should("not.exist");
  });
});
