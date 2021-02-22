/// <reference types="Cypress" />
import { shouldExist } from "./element-matchers";

/**
 * Asserts that access denied page is rendered
 */
const shouldRenderAccessDeniedPage = () => shouldExist(".c-access-denied-page");

export default shouldRenderAccessDeniedPage;
