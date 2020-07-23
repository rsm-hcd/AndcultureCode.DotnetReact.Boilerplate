/// <reference types="Cypress" />

/**
 * Assert that an element exists on the page
 * @param selector
 */
export const shouldExist = (selector) => cy.get(selector).should("exist");
