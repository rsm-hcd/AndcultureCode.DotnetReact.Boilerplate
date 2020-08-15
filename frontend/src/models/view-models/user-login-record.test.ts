import RoleRecord from "models/view-models/role-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import UserLoginRecord from "models/view-models/user-login-record";
import { TestUtils } from "utilities/test-utils";
import RoleType from "utilities/enumerations/role-type";
import UserRoleRecord from "models/view-models/user-role-record";
import { nameof } from "ts-simple-nameof";

describe(nameof(UserLoginRecord), () => {
    let sut: UserLoginRecord;
    beforeEach(() => {
        sut = Factory.build<UserLoginRecord>(FactoryType.userLoginRecord);
    });

    // -----------------------------------------------------------------------------------------
    // #region Constructor
    // -----------------------------------------------------------------------------------------

    describe("Constructor", () => {
        test("when given 'role' in params object that is not an instance of RoleRecord, it instantiates a new RoleRecord", () => {
            // Arrange & Act
            const role = Factory.build<RoleRecord>(FactoryType.roleRecord);
            sut = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                {
                    role: role.toJS() as RoleRecord,
                } // This is the important setup
            );

            // Assert
            expect(sut.role).not.toBeNull();
            expect(sut.role).toBeInstanceOf(RoleRecord);
        });
    });

    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region hasRole()
    // -----------------------------------------------------------------------------------------

    describe("hasRole()", () => {
        test("when role is undefined, it returns false", () => {
            // Arrange
            sut = Factory.build<UserLoginRecord>(FactoryType.userLoginRecord, {
                role: undefined,
            });

            // Act
            const result = sut.hasRole();

            // Arrange
            expect(result).toBe(false);
        });

        test("when role is null, it returns false", () => {
            // Arrange
            sut = Factory.build<UserLoginRecord>(FactoryType.userLoginRecord, {
                role: null as any,
            });

            // Act
            const result = sut.hasRole();

            // Arrange
            expect(result).toBe(false);
        });

        test("when role exists, it returns true", () => {
            // Arrange
            const role = Factory.build<RoleRecord>(FactoryType.roleRecord);
            sut = Factory.build<UserLoginRecord>(FactoryType.userLoginRecord, {
                role,
            });

            // Act
            const result = sut.hasRole();

            // Arrange
            expect(result).toBe(true);
        });
    });

    // #endregion hasRole()

    // -----------------------------------------------------------------------------------------
    // #region with()
    // -----------------------------------------------------------------------------------------

    describe("with()", () => {
        test("when passed a partial object with updated values, it returns a new instance with those values", () => {
            // Arrange
            const originalUserName = "Example";
            const updatedUserName = "Updated";
            sut = Factory.build<UserLoginRecord>(FactoryType.userLoginRecord, {
                userName: originalUserName,
            });

            // Act
            const result = sut.with({ userName: updatedUserName });

            // Assert
            expect(result.userName).toBe(updatedUserName);
            expect(result).not.toBe(sut); // toBe performs a referencial check, so this is checking that it truly is a new instance
        });

        test("it always returns a new instance", () => {
            // Arrange
            const sut = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord
            );

            // Act
            const result = sut.with({});

            // Assert
            expect(result).not.toBe(sut); // toBe performs a referencial check, so this is checking that it truly is a new instance
        });
    });

    // #endregion with()
});
