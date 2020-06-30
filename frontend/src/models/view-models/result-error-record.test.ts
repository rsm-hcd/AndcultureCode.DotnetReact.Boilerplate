import ResultErrorRecord from "models/view-models/result-error-record";

describe("ResultErrorRecord", () => {
    /*
    ---------------------------------------------------------------------------------------------
    fullError
    ---------------------------------------------------------------------------------------------
    */

    describe("fullError", () => {
        test("returns message", () => {
            expect(
                new ResultErrorRecord({ message: "test1" }).fullError()
            ).toContain("test1");
        });

        test("returns key", () => {
            expect(
                new ResultErrorRecord({ key: "test1" }).fullError()
            ).toContain("test1");
        });
    }); // end fullError
}); // end ResultErrorRecord
