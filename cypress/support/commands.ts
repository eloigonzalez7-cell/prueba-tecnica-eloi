/// <reference types="cypress" />

type StubItunesOptions = {
  lookupDelayMs?: number;
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Stub iTunes traffic for both Webpack `/itunes-proxy` (dev)
       * and AllOrigins URLs (prod). Aliases: `@topPodcasts`, `@podcastLookup`.
       */
      stubItunesApis(options?: StubItunesOptions): Chainable<void>;
      /** Force the top-podcasts request to fail (network error). */
      stubTopPodcastsFailure(): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "stubItunesApis",
  (options: StubItunesOptions = {}) => {
    cy.intercept("GET", /toppodcasts/, {
      fixture: "topPodcasts.json",
    }).as("topPodcasts");

    cy.intercept("GET", /lookup/, {
      fixture: "podcastLookup.json",
      ...(options.lookupDelayMs
        ? { delay: options.lookupDelayMs }
        : {}),
    }).as("podcastLookup");
  },
);

Cypress.Commands.add("stubTopPodcastsFailure", () => {
  cy.intercept("GET", /toppodcasts/, { forceNetworkError: true }).as(
    "topPodcastsError",
  );
});

export {};
