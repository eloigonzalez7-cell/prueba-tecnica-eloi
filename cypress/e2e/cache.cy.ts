describe("Client cache (24h)", () => {
  it("does not refetch top podcasts on an immediate revisit", () => {
    cy.stubItunesApis();
    cy.visit("/");
    cy.wait("@topPodcasts");
    cy.contains("a", "The Joe Budden Podcast").should("be.visible");

    cy.visit("/");
    cy.contains("a", "The Joe Budden Podcast").should("be.visible");
    cy.get("@topPodcasts.all").should("have.length", 1);
  });
});
