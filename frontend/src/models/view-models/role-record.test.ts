import RoleRecord from "models/view-models/role-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import faker from "faker";
import { nameof } from "ts-simple-nameof";

describe(nameof(RoleRecord), () => {
    let sut: RoleRecord;
    beforeEach(() => {
        sut = Factory.build<RoleRecord>(FactoryType.roleRecord);
    });

    // -----------------------------------------------------------------------------------------
    // #region getName()
    // -----------------------------------------------------------------------------------------

    describe("getName()", () => {
        test("when name is undefined, it returns an empty string", () => {
            // Arrange
            sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                name: undefined,
            });

            // Act
            const result = sut.getName();

            // Assert
            expect(result).toBe("");
        });

        test("when name is null, it returns an empty string", () => {
            // Arrange
            sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                name: null as any,
            });

            // Act
            const result = sut.getName();

            // Assert
            expect(result).toBe("");
        });

        test("when name has a value, it returns that name", () => {
            // Arrange
            const name = faker.random.word();
            sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                name,
            });

            // Act
            const result = sut.getName();

            // Assert
            expect(result).toBe(name);
        });
    });

    // #endregion getName()

    // -----------------------------------------------------------------------------------------
    // #region hasName()
    // -----------------------------------------------------------------------------------------

    describe("hasName()", () => {
        interface HasNameTestInterface {
            name?: string;
        }

        test.each`
            name
            ${undefined}
            ${null}
            ${""}
            ${" "}
        `(
            "when name is '$name', it returns false",
            ({ name }: HasNameTestInterface) => {
                // Arrange
                const sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                    name,
                });

                // Act
                const result = sut.hasName();

                // Assert
                expect(result).toBeFalse();
            }
        );

        test("when label has a value, it returns true", () => {
            // Arrange
            const sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                name: faker.random.words(),
            });

            // Act
            const result = sut.hasName();

            // Assert
            expect(result).toBeTrue();
        });
    });

    // #endregion hasName()

    // -----------------------------------------------------------------------------------------
    // #region with()
    // -----------------------------------------------------------------------------------------

    describe("with()", () => {
        test("when passed a partial object with updated values, it returns a new instance with those values", () => {
            // Arrange
            const originalName = "Example";
            const updatedName = "Updated";
            sut = Factory.build<RoleRecord>(FactoryType.roleRecord, {
                name: originalName,
            });

            // Act
            const result = sut.with({ name: updatedName });

            // Assert
            expect(result.name).toBe(updatedName);
            expect(result).not.toBe(sut); // toBe performs a referencial check, so this is checking that it truly is a new instance
        });

        test("it always returns a new instance", () => {
            // Arrange
            const sut = Factory.build<RoleRecord>(FactoryType.roleRecord);

            // Act
            const result = sut.with({});

            // Assert
            expect(result).not.toBe(sut); // toBe performs a referencial check, so this is checking that it truly is a new instance
        });
    });

    // #endregion with()
});
