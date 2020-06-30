import ResultRecord from "models/view-models/result-record";
import ErrorType from "utilities/enumerations/error-type";
import ResultErrorRecord from "models/view-models/result-error-record";
import ResultError from "models/interfaces/result-error";

describe("ResultRecord", () => {
    /*
    ---------------------------------------------------------------------------------------------
    constructor
    ---------------------------------------------------------------------------------------------
    */

    describe("constructor", () => {
        describe("errors", () => {
            test("when instantiated, given errors is array of non-record objects, errors should be wrapped in records", () => {
                // arrange
                var errors: ResultError[] = [
                    { key: "error1", message: "message1" },
                    { key: "error2", message: "message2" },
                ];

                // act
                const sut = new ResultRecord({ errors: errors as any });

                // assert
                expect(sut.errors).not.toBeNull();

                for (const error of sut.errors as any[]) {
                    expect(error).toBeInstanceOf(ResultErrorRecord);
                }
            });
        }); // end errors
    }); // end constructor

    /*
    ---------------------------------------------------------------------------------------------
    addError
    ---------------------------------------------------------------------------------------------
    */

    describe("addError", () => {
        test("when errors is null, returns errors with supplied error details", () => {
            // Arrange
            const sut = new ResultRecord({
                errors: (null as unknown) as any[],
            });

            // Act
            const result = sut.addError("testkey", "testmessage");

            // Assert
            expect(result.errors!.length).toBe(1);
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        key: "testkey",
                        message: "testmessage",
                        type: ErrorType.Error,
                    }),
                ])
            );
        });

        test("when errors has existing errors, returns with merged error details", () => {
            // Arrange
            const errors = [
                new ResultErrorRecord({
                    key: "testkey1",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
                new ResultErrorRecord({
                    key: "testkey2",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
            ];
            const sut = new ResultRecord({ errors: errors });

            // Act
            const result = sut.addError("testkey3", "testmessage3");

            // Assert
            expect(result.errors!.length).toBe(3);
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        key: "testkey3",
                        message: "testmessage3",
                        type: ErrorType.Error,
                    }),
                ])
            );
        });
    }); // end addError

    /*
    ---------------------------------------------------------------------------------------------
    addValidationError
    ---------------------------------------------------------------------------------------------
    */

    describe("addValidationError", () => {
        test("when errors is null, returns errors with supplied error details", () => {
            // Arrange
            const sut = new ResultRecord({
                errors: (null as unknown) as any[],
            });

            // Act
            const result = sut.addValidationError("testkey", "testmessage");

            // Assert
            expect(result.errors!.length).toBe(1);
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        key: "testkey",
                        message: "testmessage",
                        type: ErrorType.ValidationError,
                    }),
                ])
            );
        });

        test("when errors has existing errors, returns with merged error details", () => {
            // Arrange
            const errors = [
                new ResultErrorRecord({
                    key: "testkey1",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
                new ResultErrorRecord({
                    key: "testkey2",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
            ];
            const sut = new ResultRecord({ errors: errors });

            // Act
            const result = sut.addValidationError("testkey3", "testmessage3");

            // Assert
            expect(result.errors!.length).toBe(3);
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        key: "testkey3",
                        message: "testmessage3",
                        type: ErrorType.ValidationError,
                    }),
                ])
            );
        });
    }); // end addValidationError

    // -----------------------------------------------------------------------------------------
    // #region getErrorMessageFor
    // -----------------------------------------------------------------------------------------

    describe("getErrorMessageFor", () => {
        test("when errors is null, returns undefined", () => {
            expect(
                new ResultRecord({
                    errors: (null as unknown) as any[],
                }).getErrorMessageFor("testkey")
            ).toBeUndefined();
        });

        test("when errors is undefined, returns undefined", () => {
            expect(
                new ResultRecord({ errors: undefined }).getErrorMessageFor(
                    "testkey"
                )
            ).toBeUndefined();
        });

        test("when errors does not contain match, returns undefined", () => {
            // Arrange
            const sut = new ResultRecord().addError(
                "non-matching-key",
                "non-matching-message"
            );

            // Act & Assert
            expect(sut.getErrorMessageFor("testkey")).toBeUndefined();
        });

        test("when errors contains match, returns error message", () => {
            // Arrange
            const sut = new ResultRecord().addError(
                "matching-key",
                "matching-message"
            );

            // Act & Assert
            expect(sut.getErrorMessageFor("matching-key")).toBe(
                "matching-message"
            );
        });
    });

    /*
    ---------------------------------------------------------------------------------------------
    errorCount
    ---------------------------------------------------------------------------------------------
    */

    describe("errorCount", () => {
        test("when errors is null, returns 0", () => {
            expect(
                new ResultRecord({
                    errors: (null as unknown) as any[],
                }).errorCount()
            ).toBe(0);
        });

        test("when errors is undefined, returns 0", () => {
            expect(new ResultRecord({ errors: undefined }).errorCount()).toBe(
                0
            );
        });

        test("when errors is empty array, returns 0", () => {
            expect(new ResultRecord({ errors: [] }).errorCount()).toBe(0);
        });

        test("when errors is not empty, returns correct number of errors", () => {
            // Arrange
            const errors = [
                new ResultErrorRecord({
                    key: "testkey1",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
                new ResultErrorRecord({
                    key: "testkey2",
                    message: "testmessage",
                    type: ErrorType.Error,
                }),
            ];

            // Act & Assert
            expect(new ResultRecord({ errors: errors }).errorCount()).toBe(
                errors.length
            );
        });
    }); // end errorCount

    /*
    ---------------------------------------------------------------------------------------------
    hasErrorFor
    ---------------------------------------------------------------------------------------------
    */

    describe("hasErrorFor", () => {
        test("when errors is null, returns false", () => {
            expect(
                new ResultRecord({
                    errors: (null as unknown) as any[],
                }).hasErrorFor("testkey")
            ).toBeFalse();
        });

        test("when errors is undefined, returns false", () => {
            expect(
                new ResultRecord({ errors: undefined }).hasErrorFor("testkey")
            ).toBeFalse();
        });

        test("when errors is empty array, returns false", () => {
            expect(
                new ResultRecord({ errors: [] }).hasErrorFor("testkey")
            ).toBeFalse();
        });

        test("when errors does not contain match, returns false", () => {
            // Arrange
            const sut = new ResultRecord().addError(
                "non-matching-key",
                "non-matching-message"
            );

            // Act & Assert
            expect(sut.hasErrorFor("testkey")).toBeFalse();
        });

        test("when errors contains match, returns true", () => {
            // Arrange
            const sut = new ResultRecord().addError(
                "matching-key",
                "matching-message"
            );

            // Act & Assert
            expect(sut.hasErrorFor("matching-key")).toBeTrue();
        });
    }); // end hasErrorFor

    /*
    ---------------------------------------------------------------------------------------------
    hasErrors
    ---------------------------------------------------------------------------------------------
    */

    describe("hasErrors", () => {
        test("when errors is null, returns false", () => {
            expect(
                new ResultRecord({
                    errors: (null as unknown) as any[],
                }).hasErrors()
            ).toBeFalse();
        });

        test("when errors is undefined, returns false", () => {
            expect(
                new ResultRecord({ errors: undefined }).hasErrors()
            ).toBeFalse();
        });

        test("when errors is empty array, returns false", () => {
            expect(new ResultRecord({ errors: [] }).hasErrors()).toBeFalse();
        });

        test("when errors is not empty, returns true", () => {
            // Arrange
            const error = new ResultErrorRecord({
                key: "testkey",
                message: "testmessage",
                type: ErrorType.Error,
            });

            // Act & Assert
            expect(
                new ResultRecord({ errors: [error] }).hasErrors()
            ).toBeTrue();
        });
    }); // end hasErrors

    /*
    ---------------------------------------------------------------------------------------------
    listErrors
    ---------------------------------------------------------------------------------------------
    */

    describe("listErrors", () => {
        test("when errors is undefined, return empty array", () => {
            expect(
                new ResultRecord<any>({ errors: undefined }).listErrors()
            ).toBeEmpty();
        });

        test("when errors is array of ResultError interface, return array of full error strings", () => {
            // Arrange
            const errors: ResultError[] = [
                { key: "testkey1", message: "testmessage1" },
                { key: "testkey2", message: "testmessage2" },
            ];
            const expectedRecord1 = new ResultErrorRecord(errors[0]);
            const expectedRecord2 = new ResultErrorRecord(errors[0]);

            // Act
            const results = new ResultRecord<any>({
                errors: errors as any[],
            }).listErrors();

            // Assert
            expect(results.length).toBe(errors.length);
            expect(results).toContain(expectedRecord1.fullError());
            expect(results).toContain(expectedRecord2.fullError());
        });
    }); // end listErrors

    /*
    ---------------------------------------------------------------------------------------------
    listErrorMessages
    ---------------------------------------------------------------------------------------------
    */

    describe("listErrorMessages", () => {
        test("when errors is undefined, return empty array", () => {
            expect(
                new ResultRecord<any>({ errors: undefined }).listErrorMessages()
            ).toBeEmpty();
        });

        test("when errors is array of ResultError interface, return array of error messages", () => {
            // Arrange
            const errors: ResultError[] = [
                { key: "testkey1", message: "testmessage1" },
                { key: "testkey2", message: "testmessage2" },
            ];
            const expectedRecord1 = new ResultErrorRecord(errors[0]);
            const expectedRecord2 = new ResultErrorRecord(errors[1]);

            // Act
            const results = new ResultRecord<any>({
                errors: errors as any[],
            }).listErrorMessages();

            // Assert
            expect(results.length).toBe(errors.length);
            expect(results).toContain(expectedRecord1.message);
            expect(results).toContain(expectedRecord2.message);
        });
    }); // end listErrors
}); // end ResultRecord
