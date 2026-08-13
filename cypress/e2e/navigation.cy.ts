describe("Navigation chrome", () => {
  it("shows the header loading indicator during client navigation", () => {
    cy.stubItunesApis({ lookupDelayMs: 600 });
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.contains("a", "The Joe Budden Podcast").click();
    cy.get('[aria-label="Loading"]').should("be.visible");
    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Podcast",
    );
    cy.url().should("include", "/podcast/1535809341");
    cy.get('[aria-label="Loading"]').should("not.exist");
  });

  it("returns home when clicking the Podcaster brand link", () => {
    cy.stubItunesApis();
    cy.visit("/podcast/1535809341");
    cy.get('aside[aria-label="Podcast summary"]').should(
      "contain",
      "The Joe Budden Podcast",
    );

    cy.contains("a", "Podcaster").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.wait("@topPodcasts");
    cy.get("#podcast-filter").should("be.visible");
  });
});
