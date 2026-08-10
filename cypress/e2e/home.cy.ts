describe("Home", () => {
  it("filters podcasts by title while typing", () => {
    cy.stubItunesApis();
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

  it("filters podcasts by author", () => {
    cy.stubItunesApis();
    cy.visit("/");
    cy.wait("@topPodcasts");

    cy.get("#podcast-filter").type("Hirway");
    cy.contains("output", "1").should("be.visible");
    cy.contains("a", "Song Exploder").should("be.visible");
    cy.contains("a", "The Joe Budden Podcast").should("not.exist");
  });

  it("shows an error banner and recovers with Retry", () => {
    cy.stubTopPodcastsFailure();
    cy.visit("/");
    cy.wait("@topPodcastsError");

    cy.get('[role="alert"]').should(
      "contain",
      "Could not load podcasts",
    );

    cy.stubItunesApis();
    cy.contains("button", "Retry").click();
    cy.wait("@topPodcasts");

    cy.get('[role="alert"]').should("not.exist");
    cy.contains("a", "The Joe Budden Podcast").should("be.visible");
  });
});
