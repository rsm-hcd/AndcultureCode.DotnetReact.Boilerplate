/// <reference types="Cypress" />

/**
 * Asserts that access denied page is rendered
 */
const shouldRenderAccessDeniedPage = () =>
    cy.get(".c-access-denied-page").should("exist");

export default shouldRenderAccessDeniedPage;
