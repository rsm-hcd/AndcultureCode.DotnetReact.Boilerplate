import "@testing-library/jest-dom/extend-expect";
import { GlobalWithFetchMock } from "jest-fetch-mock";

require("jest-extended");
require("tests/factories");

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require("jest-fetch-mock");
customGlobal.fetchMock = customGlobal.fetch;

// Run before each individual test across the entire test suite
beforeEach(() => {
    jest.resetAllMocks();
});
