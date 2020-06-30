/**
 * Constructs full versioned API url
 * @param {string} identifier
 */
export const apiUrl = (relativePath) =>
    Cypress.env("apiBaseUrl") + relativePath;
