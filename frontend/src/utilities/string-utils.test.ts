import StringUtils from "utilities/string-utils";
import Faker from "faker";
describe("StringUtils", () => {
    // -----------------------------------------------------------------------------------------
    // #region generateExcerpt()
    // -----------------------------------------------------------------------------------------

    describe("generateExcerpt()", () => {
        test("when input string does not contain substring, it returns the input string", () => {
            // Arrange
            const inputString = "123456789";
            const substring = "abc";
            const characterLimit = 5;

            // Act
            const result = StringUtils.generateExcerpt(
                inputString,
                substring,
                characterLimit
            );

            // Assert
            expect(result).toBe(inputString);
        });

        test("when input string contains substring, it always returns a string containing the substring", () => {
            // Arrange
            const substring = `<em>andculture</em>`;
            const inputString = `${Faker.random
                .word()
                .repeat(25)} ${substring} ${Faker.random.word().repeat(25)}`;
            const characterLimit = 215;

            // Act
            const result = StringUtils.generateExcerpt(
                inputString,
                substring,
                characterLimit
            );

            // Assert
            expect(result).toContain(substring);
        });

        /**
         * This is a test to handle the case where an earlier implementation of the excerpt algorithm
         * was fanning out on both the left and right sides of the substring at the same time, and
         * short-circuiting earlier.
         *
         * Essentially, if the substring was too close to the beginning or end of the input string,
         * it could potentially cut out more of the excerpt than was desired due to not having more
         * words on the left or right side as it was building out the 'excerpt' string.
         *
         * If the substring appears at the end of the input string, it makes logical sense that the
         * left side of the excerpt will be longer. If the substring appears at the beginning
         * of the input string, it makes logical sense that the right side of the excerpt will be longer.
         */
        test("when substring exists at beginning of input string, it returns a string logically truncated around the substring", () => {
            // Arrange
            const substring = "<em>electrical</em>";
            const inputString = `682.12 All ${substring} connections not intended for operation while submerged shall be located at least 300 mm (12 in.) above the deck of a floating or fixed structure, but not below the <em>electrical</em> datum plane.`;
            const characterLimit = 215;

            // Act
            const result = StringUtils.generateExcerpt(
                inputString,
                substring,
                characterLimit
            );

            // Assert
            // Words BEFORE the substring
            expect(result).toContain("All");
            // Words AFTER the substring
            expect(result).toContain(
                "connections not intended for operation while submerged"
            );
        });

        /**
         * This is a test to handle the case where an earlier implementation of the excerpt algorithm
         * was fanning out on both the left and right sides of the substring at the same time, and
         * short-circuiting earlier.
         *
         * Essentially, if the substring was too close to the beginning or end of the input string,
         * it could potentially cut out more of the excerpt than was desired due to not having more
         * words on the left or right side as it was building out the 'excerpt' string.
         *
         * If the substring appears at the end of the input string, it makes logical sense that the
         * left side of the excerpt will be longer. If the substring appears at the beginning
         * of the input string, it makes logical sense that the right side of the excerpt will be longer.
         */
        test("when substring exists at end of input string, it returns a string logically truncated around the substring", () => {
            // Arrange
            const substring = "<em>datum</em>";
            const inputString = `682.12 All electrical connections not intended for operation while submerged shall be located at least 300 mm (12 in.) above the deck of a floating or fixed structure but not below the electrical ${substring} plane.`;
            const characterLimit = 215;

            // Act
            const result = StringUtils.generateExcerpt(
                inputString,
                substring,
                characterLimit
            );

            // Assert
            // Words BEFORE the substring
            expect(result).toContain("structure but not below the electrica");
            // Words AFTER the substring
            expect(result).toContain("plane.");
        });
    });

    // #endregion generateExcerpt()

    // -------------------------------------------------------------------------------------------------
    // #region hasValue
    // -------------------------------------------------------------------------------------------------

    describe("hasValue", (): void => {
        test.each`
            inputString                | returnValue
            ${null}                    | ${false}
            ${undefined}               | ${false}
            ${""}                      | ${false}
            ${" "}                     | ${false}
            ${123456789}               | ${true}
            ${"Something blue"}        | ${true}
            ${["Something blue"]}      | ${true}
            ${{ a: "Something blue" }} | ${true}
        `(
            `when inputString is $inputString, hasValue returns $returnValue`,
            ({ inputString, returnValue }: any): void => {
                // Arrange & Act
                const result: boolean = StringUtils.hasValue(inputString);

                // Assert
                expect(result).toBe(returnValue);
            }
        );
    });

    // #endregion stringHasValue

    // -------------------------------------------------------------------------------------------------
    // #region isEmpty
    // -------------------------------------------------------------------------------------------------

    describe("isEmpty", (): void => {
        test.each`
            inputString                | returnValue
            ${null}                    | ${true}
            ${undefined}               | ${true}
            ${""}                      | ${true}
            ${" "}                     | ${true}
            ${123456789}               | ${false}
            ${"Something blue"}        | ${false}
            ${["Something blue"]}      | ${false}
            ${{ a: "Something blue" }} | ${false}
        `(
            `when inputString is $inputString, isEmpty returns $returnValue`,
            ({ inputString, returnValue }: any): void => {
                // Arrange & Act
                const result: boolean = StringUtils.isEmpty(inputString);

                // Assert
                expect(result).toBe(returnValue);
            }
        );
    });

    // #endregion isEmpty

    // -------------------------------------------------------------------------------------------------
    // #region isValidEmail
    // -------------------------------------------------------------------------------------------------

    describe("isValidEmail", (): void => {
        test.each`
            inputString                                   | returnValue
            ${"prettyandsimple@example.com"}              | ${true}
            ${"x@example.com"}                            | ${true}
            ${"fully-qualified-domain@example.com"}       | ${true}
            ${'"very.unusual.@.unusual.com"@example.com'} | ${true}
            ${"/#!$%&'*+-/=?^_`{}|~@example.org"}         | ${true}
            ${"Abc.example.com"}                          | ${false}
            ${"A@b@c@example.com"}                        | ${false}
            ${["john..doe@example.com"]}                  | ${false}
        `(
            `when inputString is $inputString, isValidEmail returns $returnValue`,
            ({ inputString, returnValue }: any): void => {
                // Arrange & Act
                const result: boolean = StringUtils.isValidEmail(inputString);

                // Assert
                expect(result).toBe(returnValue);
            }
        );
    });

    // #endregion isValidEmail

    // -------------------------------------------------------------------------------------------------
    // #region isValidPassword
    // -------------------------------------------------------------------------------------------------

    describe("isValidPassword", (): void => {
        test.each`
            inputString                               | returnValue
            ${"Test1!"}                               | ${true}
            ${"vaLid#__"}                             | ${true}
            ${"8i}&ko_MkrW&KL"}                       | ${true}
            ${"}Z01bcO)K^EMB7W,^.z>^*F44f"}           | ${true}
            ${"everything_but_uppercase_letter1"}     | ${true}
            ${"short"}                                | ${false}
            ${"UppercaseLettersLowercaseLettersOnly"} | ${false}
            ${"UPPERCASELETTERSNUMBERSONLY2222"}      | ${false}
            ${"UPPERCASELETTERSCHARACTERSONLY!!!"}    | ${false}
            ${"lowercaseandcharacteronly!!"}          | ${false}
            ${"lowercaseandnumberonly!!"}             | ${false}
            ${"!!!!!!!123423421342134"}               | ${false}
        `(
            `when inputString is $inputString, isValidPassword returns $returnValue`,
            ({ inputString, returnValue }: any): void => {
                // Arrange & Act
                const result: boolean = StringUtils.isValidPassword(
                    inputString
                );

                // Assert
                expect(result).toBe(returnValue);
            }
        );
    });

    // #endregion isValidPassword

    // -------------------------------------------------------------------------------------------------
    // #region isValidPhoneNumber
    // -------------------------------------------------------------------------------------------------

    describe("isValidPhoneNumber", (): void => {
        test.each`
            inputString         | returnValue
            ${"3087774825"}     | ${true}
            ${"(281)388-0388"}  | ${true}
            ${"(281)388-0300"}  | ${true}
            ${"(979) 778-0978"} | ${true}
            ${"(281)934-2479"}  | ${true}
            ${"(281)934-2447"}  | ${true}
            ${"(979)826-3273"}  | ${true}
            ${"(979)826-3255"}  | ${true}
            ${"1334714149"}     | ${true}
            ${"(281)356-2530"}  | ${true}
            ${"(281)356-5264"}  | ${true}
            ${"(936)825-2081"}  | ${true}
            ${"(832)595-9500"}  | ${true}
            ${"(832)595-9501"}  | ${true}
            ${"281-342-2452"}   | ${true}
            ${"1334431660"}     | ${true}
        `(
            `when inputString is $inputString, isValidPhoneNumber returns $returnValue`,
            ({ inputString, returnValue }: any): void => {
                // Arrange & Act
                const result: boolean = StringUtils.isValidPhoneNumber(
                    inputString
                );

                // Assert
                expect(result).toBe(returnValue);
            }
        );
    });

    // #endregion isValidPhoneNumber

    // -----------------------------------------------------------------------------------------
    // #region join()
    // -----------------------------------------------------------------------------------------

    describe("join()", () => {
        describe("with the default separator", () => {
            type JoinTestTypes = [string[], string];

            test.each<JoinTestTypes>([
                [[], ""],
                [["a"], "a"],
                [["a"], "a"],
                [["a", "b"], "a,b"],
            ])(
                "when values is %p,  returns %p",
                (values: string[], expected: string) => {
                    // Arrange & Act
                    const result: string = StringUtils.join(values);

                    // Assert
                    expect(result).toBe(expected);
                }
            );
        });

        describe("with a separator argument", () => {
            type JoinTestTypesWithSeparator = [string[], string, string];

            test.each<JoinTestTypesWithSeparator>([
                [[], "", ""],
                [["a"], "", "a"],
                [["a"], ",", "a"],
                [["a", "b"], "", "ab"],
                [["a", "b"], " ", "a b"],
            ])(
                "when values is %p and separator is %p, returns %p",
                (values: string[], separator: string, expected: string) => {
                    // Arrange & Act
                    const result: string = StringUtils.join(values, separator);

                    // Assert
                    expect(result).toBe(expected);
                }
            );
        });
    });

    // #endregion join

    // -----------------------------------------------------------------------------------------
    // #region joinClassNames()
    // -----------------------------------------------------------------------------------------

    describe("joinClassNames", () => {
        type JoinClassNamesTypes = [string[], string];

        test.each<JoinClassNamesTypes>([
            [[], ""],
            [["class"], "class"],
            [["class1", "class2"], "class1 class2"],
            [["class1", "", "class2"], "class1  class2"], // <- We're not removing extra white space or empty array elements.
            [["class1", " ", "class2"], "class1   class2"], // <- We're not removing extra white space or empty array elements.
        ])(
            "when classnames are %p,  returns %p",
            (values: string[], expected: string) => {
                // Arrange & Act
                const result: string = StringUtils.joinClassNames(values);

                // Assert
                expect(result).toBe(expected);
            }
        );
    });

    // #endregion joinClassNames

    // -----------------------------------------------------------------------------------------
    // #region truncateRight()
    // -----------------------------------------------------------------------------------------

    describe("truncateRight()", () => {
        const ENGLISH_PANGRAM = "The quick brown fox jumps over the lazy dog.";
        test("when length of input string is less than truncateAtPos, it returns the input string", () => {
            // Arrange
            const inputString = "a".repeat(5);
            const truncateAtPos = 10;

            // Act
            const result = StringUtils.truncateRight(
                inputString,
                truncateAtPos
            );

            // Assert
            expect(result).toBe(inputString);
        });

        test("when length of input string is equal to truncateAtPos, it returns the input string", () => {
            // Arrange
            const inputString = "a".repeat(5);
            const truncateAtPos = 5;

            // Act
            const result = StringUtils.truncateRight(
                inputString,
                truncateAtPos
            );

            // Assert
            expect(result).toBe(inputString);
        });

        test("when the inputString is shorter than the truncateAtPos, it returns the unmodified string", () => {
            // Arrange & Act
            const result = StringUtils.truncateRight(
                ENGLISH_PANGRAM,
                ENGLISH_PANGRAM.length + 1
            );

            // Assert
            expect(result).toBe(ENGLISH_PANGRAM);
        });

        test("when the inputString is the same length as the truncateAtPos, it returns the unmodified string", () => {
            // Arrange & Act
            const result = StringUtils.truncateRight(
                ENGLISH_PANGRAM,
                ENGLISH_PANGRAM.length
            );

            // Assert
            expect(result).toBe(ENGLISH_PANGRAM);
        });

        test("when the inputString is longer than the truncateAtPos, it returns the string truncated with ellipses", () => {
            // Arrange & Act
            const result = StringUtils.truncateRight(
                ENGLISH_PANGRAM,
                ENGLISH_PANGRAM.length - 1
            );

            // Assert
            expect(result).toBe("The quick brown fox jumps over the lazy...");
        });

        test("when the inputString is longer than the truncateAtPos and the truncated string ends with a period, it returns a string without ending ellipses", () => {
            // Arrange
            const inputString = "A sentence. The";
            // Truncate 1 character, plus 3 for the potential ellipses. This method should trim the
            // result and see that the string already ends with a period, which it will not append
            // any additional characters.
            const truncateAtPos = inputString.length - 1;

            // Act
            const result = StringUtils.truncateRight(
                inputString,
                truncateAtPos
            );

            // Assert

            expect(result).toBe("A sentence.");
        });
    });

    // #endregion truncateRight()
});
