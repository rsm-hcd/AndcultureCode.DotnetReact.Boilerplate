import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import UserRecord from "models/view-models/user-record";
import faker from "faker";

describe("UserRecord", () => {
    // -----------------------------------------------------------------------------------------
    // #region hasFirstName
    // -----------------------------------------------------------------------------------------

    describe("hasFirstName", () => {
        interface HasFirstNameTestInterface {
            firstName: string | undefined;
        }

        test.each`
            firstName
            ${undefined}
            ${null}
            ${""}
            ${" "}
        `(
            "when firstName is '$value', it returns false",
            ({ firstName }: HasFirstNameTestInterface) => {
                // Arrange
                const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                    firstName,
                });

                // Act
                const result = sut.hasFirstName();

                // Assert
                expect(result).toBeFalse();
            }
        );

        test("when firstName has a value, it returns true", () => {
            // Arrange
            const firstName = faker.name.firstName();
            const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                firstName,
            });

            // Act
            const result = sut.hasFirstName();

            // Assert
            expect(result).toBeTrue();
        });
    });

    // #endregion hasFirstName

    // -----------------------------------------------------------------------------------------
    // #region hasLastName
    // -----------------------------------------------------------------------------------------

    describe("hasLastName", () => {
        interface HasLastNameTestInterface {
            lastName: string | undefined;
        }

        test.each`
            lastName
            ${undefined}
            ${null}
            ${""}
            ${" "}
        `(
            "when lastName is '$value', it returns false",
            ({ lastName }: HasLastNameTestInterface) => {
                // Arrange
                const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                    lastName,
                });

                // Act
                const result = sut.hasLastName();

                // Assert
                expect(result).toBeFalse();
            }
        );

        test("when lastName has a value, it returns true", () => {
            // Arrange
            const lastName = faker.name.lastName();
            const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                lastName,
            });

            // Act
            const result = sut.hasLastName();

            // Assert
            expect(result).toBeTrue();
        });
    });

    // #endregion hasLastName

    // -----------------------------------------------------------------------------------------
    // #region initials
    // -----------------------------------------------------------------------------------------

    describe("initials", () => {
        test("when 'firstName' is empty, it returns an empty string", () => {
            // Arrange
            const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                firstName: "",
                lastName: faker.name.lastName(),
            });

            // Act
            const result = sut.initials();

            // Assert
            expect(result).toBeEmpty();
        });

        test("when 'lastName' is empty, it returns an empty string", () => {
            // Arrange
            const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                firstName: faker.name.firstName(),
                lastName: "",
            });

            // Act
            const result = sut.initials();

            // Assert
            expect(result).toBeEmpty();
        });

        test("when 'firstName' and 'lastName' have values, it returns the first character of each", () => {
            // Arrange
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const sut = Factory.build<UserRecord>(FactoryType.userRecord, {
                firstName,
                lastName,
            });

            // Act
            const result = sut.initials();

            // Assert
            expect(result).toBe(`${firstName[0]}${lastName[0]}`);
        });
    });

    // #endregion initials
});
