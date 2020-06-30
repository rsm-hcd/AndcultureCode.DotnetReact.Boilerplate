import { AxiosResponse } from "axios";
import ServiceUtils from "utilities/service-utils";
import UserRecord from "models/view-models/user-record";
import User from "models/interfaces/user";
import Result from "models/interfaces/result";
import ResultRecord from "models/view-models/result-record";
import PagedResult from "models/interfaces/paged-result";

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

    /*
    ---------------------------------------------------------------------------------------------
    mapAxiosResponse
    ---------------------------------------------------------------------------------------------
    */

    describe("mapAxiosResponse", () => {
        test("when axiosResponse is null, returns null", () => {
            expect(
                ServiceUtils.mapAxiosResponse(UserRecord, null as any)
            ).toBeNull();
        });

        test("when axiosResponse is undefined, returns undefined", () => {
            expect(
                ServiceUtils.mapAxiosResponse(UserRecord, undefined as any)
            ).toBeUndefined();
        });

        test("when axiosResponse.data.resultObject is set, converts to supplied record type", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {
                    resultObject: {
                        email: expected,
                    } as User,
                },
            } as AxiosResponse<Result<UserRecord>>;

            // act
            const result = ServiceUtils.mapAxiosResponse(UserRecord, response);

            // assert
            expect(result.resultObject).toBeInstanceOf(UserRecord);
            expect((result.resultObject as UserRecord).email).toBe(expected);
        });

        test("when axiosResponse.data is set, converts to ResultRecord", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {
                    errors: [{ key: "error1", message: "message1" }],
                } as Result<User>,
            } as AxiosResponse<Result<UserRecord>>;

            // act
            const result = ServiceUtils.mapAxiosResponse(UserRecord, response);

            // assert
            expect(result.result).toBeInstanceOf(ResultRecord);
            expect(
                (result.result as ResultRecord<UserRecord>).hasErrors()
            ).toBeTrue();
        });

        test("when axiosResponse is set, returns rowCount of 1", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {},
            } as AxiosResponse<Result<UserRecord>>;

            // act
            const result = ServiceUtils.mapAxiosResponse(UserRecord, response);

            // assert
            expect(result.rowCount).toBe(1);
        });

        test("when axiosResponse.status is set, returns status", () => {
            // arrange
            const expected = 200;
            const response = {
                status: expected,
            } as AxiosResponse<Result<UserRecord>>;

            // act
            const result = ServiceUtils.mapAxiosResponse(UserRecord, response);

            // assert
            expect(result.status).toBe(expected);
        });
    }); // end mapAxiosResponse

    /*
    ---------------------------------------------------------------------------------------------
    mapPagedAxiosResponse
    ---------------------------------------------------------------------------------------------
    */
    describe("mapPagedAxiosResponse", () => {
        test("when axiosResponse is null, returns null", () => {
            expect(
                ServiceUtils.mapPagedAxiosResponse(UserRecord, null as any)
            ).toBeNull();
        });
        test("when axiosResponse is undefined, returns undefined", () => {
            expect(
                ServiceUtils.mapPagedAxiosResponse(UserRecord, undefined as any)
            ).toBeUndefined();
        });
        test("when axiosResponse.data.resultObject is set, converts to array of supplied record type", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {
                    resultObject: [
                        {
                            email: expected,
                        },
                    ] as User[],
                },
            } as AxiosResponse<PagedResult<UserRecord>>;
            // act
            const result = ServiceUtils.mapPagedAxiosResponse(
                UserRecord,
                response
            );
            // assert
            expect(result.resultObjects).not.toBeNull();
            for (const user of result.resultObjects as any[]) {
                expect(user).toBeInstanceOf(UserRecord);
            }
        });
        test("when axiosResponse.data is set, converts to ResultRecord", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {
                    errors: [{ key: "error1", message: "message1" }],
                } as Result<User>,
            } as AxiosResponse<PagedResult<UserRecord>>;
            // act
            const result = ServiceUtils.mapPagedAxiosResponse(
                UserRecord,
                response
            );
            // assert
            expect(result.results).toBeInstanceOf(ResultRecord);
            expect(
                (result.results as ResultRecord<UserRecord[]>).hasErrors()
            ).toBeTrue();
        });
        test("when axiosResponse.rowCount is set, returns matching rowCount", () => {
            // arrange
            const expected = "testemail";
            const response = {
                data: {
                    rowCount: 10,
                },
            } as AxiosResponse<PagedResult<UserRecord>>;
            // act
            const result = ServiceUtils.mapPagedAxiosResponse(
                UserRecord,
                response
            );
            // assert
            expect(result.rowCount).toBe(response.data.rowCount);
        });
        test("when axiosResponse.status is set, returns status", () => {
            // arrange
            const expected = 200;
            const response = {
                data: {},
                status: expected,
            } as AxiosResponse<PagedResult<UserRecord>>;
            // act
            const result = ServiceUtils.mapPagedAxiosResponse(
                UserRecord,
                response
            );
            // assert
            expect(result.status).toBe(expected);
        });
    }); // end mapPagedAxiosResponse
});
