import NumberUtils from "utilities/number-utils";
import faker from "faker";

describe("NumberUtils", () => {
    // -----------------------------------------------------------------------------------------
    // #region parseInt
    // -----------------------------------------------------------------------------------------

    describe("parseInt", () => {
        interface ParseIntTestInterface {
            value?: number | string;
            expected?: number;
        }

        test.each`
            value
            ${undefined}
            ${null}
        `(
            "when given $value, it returns undefined",
            ({ value }: ParseIntTestInterface) => {
                // Arrange & Act
                const result = NumberUtils.parseInt(value);

                // Assert
                expect(result).toBeUndefined();
            }
        );

        test.each`
            value         | expected
            ${"1"}        | ${1}
            ${"1.5"}      | ${1}
            ${"1.49"}     | ${1}
            ${"1.51"}     | ${1}
            ${NaN}        | ${undefined}
            ${"a string"} | ${undefined}
        `(
            "when given $value, it returns $expected",
            ({ value, expected }: ParseIntTestInterface) => {
                // Arrange & Act
                const result = NumberUtils.parseInt(value);

                // Assert
                expect(result).toBe(expected);
            }
        );

        test("when given a number, it returns that value", () => {
            // Arrange
            const value = faker.random.number();

            // Act
            const result = NumberUtils.parseInt(value);

            // Assert
            expect(result).toBe(value);
        });
    });

    // #endregion parseInt
});
