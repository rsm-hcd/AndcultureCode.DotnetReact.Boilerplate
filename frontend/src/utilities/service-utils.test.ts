import { AxiosResponse } from "axios";
import ServiceUtils from "utilities/service-utils";
import { ResultRecord } from "andculturecode-javascript-core";

describe("ServiceUtils", () => {
    /*
    ---------------------------------------------------------------------------------------------
    handleApiResponseError
    ---------------------------------------------------------------------------------------------
    */

    describe("handleApiResponseError", () => {
        test("when error null, returns rejected promise", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError(null);

            // assert
            let isCatchCalled = false;
            try {
                await result;
            } catch (err) {
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
        });
        test("when error undefined, returns rejected promise", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError(undefined);

            // assert
            let isCatchCalled = false;
            try {
                await result;
            } catch (err) {
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
        });
        test("when error.response null, returns rejected promise", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError({
                response: null,
            });

            // assert
            let isCatchCalled = false;
            try {
                await result;
            } catch (err) {
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
        });
        test("when error.response undefined, returns rejected promise", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError({
                response: undefined,
            });

            // assert
            let isCatchCalled = false;
            try {
                await result;
            } catch (err) {
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
        });
        test("when response data has errors, returns rejected promise with result record", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError({
                response: {
                    data: {
                        errors: [{ key: "error1", message: "message1" }],
                    },
                },
            });

            // assert
            let isCatchCalled = false;
            let errorResult = undefined;
            try {
                await result;
            } catch (err) {
                errorResult = err;
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
            expect(errorResult).toBeInstanceOf(ResultRecord);
        });

        test("when response data does not have error, returns rejected promise with result record containing unknown error", async () => {
            // act
            const result = ServiceUtils.handleApiResponseError({
                response: {
                    data: {}, // <--------- no errors
                },
                status: 999, // <--------- unhandled error code
            });

            // assert
            let isCatchCalled = false;
            let errorResult = undefined;
            try {
                await result;
            } catch (err) {
                errorResult = err;
                isCatchCalled = true;
            }

            expect(isCatchCalled).toBeTrue();
            expect(errorResult).toBeInstanceOf(ResultRecord);

            expect(
                (errorResult as ResultRecord<any>).hasErrorFor("Unknown")
            ).toBeTrue();
        });
    }); // end handleApiResponseError

    /*
    ---------------------------------------------------------------------------------------------
    handleApiResponseSuccess
    ---------------------------------------------------------------------------------------------
    */

    describe("handleApiResponseSuccess", () => {
        test("when supplied value, forward exact value", () => {
            // arrange
            const expected = {} as AxiosResponse<any>;

            // act
            const result = ServiceUtils.handleApiResponseSuccess(expected);

            // assert
            expect(result).toBe(expected);
        });
    }); // end handleApiResponseSuccess
});
