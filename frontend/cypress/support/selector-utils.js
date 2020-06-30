/**
 * Convenient way to create conventional data-test-id attribute-based selector
 * @param {string} identifier
 */
export const selectTestId = (identifier) => `[data-test-id=${identifier}]`;
