/// <reference types="Cypress" />

/**
 * Asserts that the current URL matches the provided URL
 * @param {string} relativePath
 * @param {Partial<Loggable & Timeoutable>} options
 */
const urlShouldEqual = (relativePath, options = {}) => {
    if (!Cypress._(relativePath).startsWith("/")) {
        relativePath = "/" + relativePath;
    }

    cy.url(options).should("eq", Cypress.config().baseUrl + relativePath);
};

export { urlShouldEqual };
