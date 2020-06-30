import GlobalStateRecord from "models/view-models/global-state-record";
import IdentityRecord from "models/view-models/identity-record";
import SystemSettingsRecord from "models/view-models/system-settings-record";
import UserLoginRecord from "models/view-models/user-login-record";
import UserRecord from "models/view-models/user-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import { LocalStorageUtils } from "utilities/local-storage-utils";

describe("GlobalStateRecord", () => {
    // -----------------------------------------------------------------------------------------
    // #region getSystemSettings()
    // -----------------------------------------------------------------------------------------

    describe("getSystemSettings()", () => {
        test("when systemSettings is undefined, it returns a new instance", () => {
            // Arrange
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                { systemSettings: undefined }
            );

            // Act
            const result = record.getSystemSettings();

            // Assert
            expect(result).toEqual(new SystemSettingsRecord());
        });

        test("when systemSettings is null, it returns a new instance", () => {
            // Arrange
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                { systemSettings: null as any }
            );

            // Act
            const result = record.getSystemSettings();

            // Assert
            expect(result).toEqual(new SystemSettingsRecord());
        });

        test("when systemSettings has a value, it returns that value", () => {
            // Arrange
            const systemSettings = Factory.build<SystemSettingsRecord>(
                FactoryType.systemSettingsRecord
            );
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                { systemSettings: systemSettings }
            );

            // Act
            const result = record.getSystemSettings();

            // Assert
            expect(result).toEqual(systemSettings);
        });
    });

    // #endregion getSystemSettings()

    // -----------------------------------------------------------------------------------------
    // #region hasSystemSettings()
    // -----------------------------------------------------------------------------------------

    describe("hasSystemSettings()", () => {
        test("when systemSettings is undefined, it returns false", () => {
            // Arrange
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                { systemSettings: undefined }
            );

            // Act
            const result = record.hasSystemSettings();

            // Assert
            expect(result).toBeFalse();
        });

        test("when systemSettings is null, it returns false", () => {
            // Arrange
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                { systemSettings: null as any }
            );

            // Act
            const result = record.hasSystemSettings();

            // Assert
            expect(result).toBeFalse();
        });

        test("when systemSettings has a value, it returns true", () => {
            // Arrange
            const record = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                {
                    systemSettings: Factory.build<SystemSettingsRecord>(
                        FactoryType.systemSettingsRecord
                    ),
                }
            );

            // Act
            const result = record.hasSystemSettings();

            // Assert
            expect(result).toBeTrue();
        });
    });

    // #endregion hasSystemSettings()

    // -----------------------------------------------------------------------------------------
    // #region isAuthenticated
    // -----------------------------------------------------------------------------------------

    describe("isAuthenticated", () => {
        test("when currentIdentity is undefined, returns false", () => {
            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    { currentIdentity: undefined }
                ).isAuthenticated()
            ).toBeFalse();
        });

        test("when currentIdentity is null, returns false", () => {
            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: null as any,
                    }
                ).isAuthenticated()
            ).toBeFalse();
        });

        test("when currentUserLogin is UserLoginRecord with #id set to null, returns false", () => {
            const user = Factory.build<UserRecord>(FactoryType.user, { id: 1 });
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: null as any, userId: user.id }
            );
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { user, userLogin }
            );

            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                ).isAuthenticated()
            ).toBeFalse();
        });

        test("when currentUserLogin is UserLoginRecord with #id set to undefined, returns false", () => {
            const user = Factory.build<UserRecord>(FactoryType.user, {
                id: undefined,
            });
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: undefined, userId: user.id }
            );
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { user, userLogin }
            );

            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                ).isAuthenticated()
            ).toBeFalse();
        });

        test("when currentUserLogin is UserLoginRecord with #id of 0, returns false", () => {
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: 0 }
            );

            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { userLogin }
            );

            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                ).isAuthenticated()
            ).toBeFalse();
        });

        test("when currentUserLogin is UserLoginRecord with #id greater than 0, returns true", () => {
            const user = Factory.build<UserRecord>(FactoryType.user, { id: 1 });
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: 1, userId: user.id }
            );
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { user, userLogin }
            );

            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                ).isAuthenticated()
            ).toBeTrue();
        });
    }); // end isAuthenticated

    // #endregion isAuthenticated

    // -----------------------------------------------------------------------------------------
    // #region setIdentity
    // -----------------------------------------------------------------------------------------

    describe("setIdentity", () => {
        test("when supplied undefined, isAuthenticated is false", () => {
            expect(
                Factory.build<GlobalStateRecord>(FactoryType.globalStateRecord)
                    .setIdentity(undefined as any)
                    .isAuthenticated()
            ).toBeFalse();
        });

        test("when supplied null, isAuthenticated is false", () => {
            expect(
                Factory.build<GlobalStateRecord>(FactoryType.globalStateRecord)
                    .setIdentity(null as any)
                    .isAuthenticated()
            ).toBeFalse();
        });

        test("when supplied userLogin with #id of undefined, #currentUserLogin is unset", () => {
            // Arrange
            const user = Factory.build<UserRecord>(FactoryType.user, { id: 1 });
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: undefined, userId: user.id }
            );
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { user, userLogin }
            );

            // Act
            const result = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord
            ).setIdentity(identity);

            // Assert
            expect(result.currentIdentity).toBeUndefined();
        });

        test("when supplied userLogin with valid #id, #currentUserLogin is set", () => {
            // Arrange
            const user = Factory.build<UserRecord>(FactoryType.user, {
                id: 10,
            });
            const userLogin = Factory.build<UserLoginRecord>(
                FactoryType.userLoginRecord,
                { id: 1, userId: user.id }
            );
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                { user, userLogin }
            );
            const globalState = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                {
                    currentIdentity: identity,
                }
            );

            // Act
            const result = globalState.setIdentity(identity);

            // Assert
            expect(result.currentIdentity).not.toBeUndefined();
            expect(result.currentIdentity!.userId()).toBe(10);
        });
    }); // end setIdentity

    // #endregion setIdentity

    // -----------------------------------------------------------------------------------------
    // #region setSystemSettings
    // -----------------------------------------------------------------------------------------

    describe("setSystemSettings", () => {
        test("when systemSettingsRecord is undefined, it returns a new instance with the same values", () => {
            // Arrange
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord
            );

            // Act
            const result = sut.setSystemSettings(undefined as any);

            // Assert
            expect(result === sut).toBeFalse(); // Check that the instance is new (different reference)
            expect(result).toEqual(sut); // Deep equality check the values
        });

        test("when systemSettingsRecord is null, it returns a new instance with the same values", () => {
            // Arrange
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord
            );

            // Act
            const result = sut.setSystemSettings(null as any);

            // Assert
            expect(result === sut).toBeFalse(); // Check that the instance is new (different reference)
            expect(result).toEqual(sut); // Deep equality check the values
        });

        test("when systemSettingsRecord has a value, it returns a new record with the updated value", () => {
            // Arrange
            const systemSettingsRecord = Factory.build<SystemSettingsRecord>(
                FactoryType.systemSettingsRecord
            );
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord
            );

            // Act
            const result = sut.setSystemSettings(systemSettingsRecord);

            // Assert
            expect(result === sut).toBeFalse(); // Check that the instance is new (different reference)
            expect(result.systemSettings).toEqual(systemSettingsRecord);
        });

        test("when systemSettingsRecord has a value, it calls LocalStorageUtils.set()", () => {
            // Arrange
            const localStorageUtilsSpy = jest
                .spyOn(LocalStorageUtils, "set")
                .mockImplementation(() => null);
            const systemSettingsRecord = Factory.build<SystemSettingsRecord>(
                FactoryType.systemSettingsRecord
            );
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord
            );

            // Act
            sut.setSystemSettings(systemSettingsRecord);

            // Assert
            expect(localStorageUtilsSpy).toHaveBeenCalled();
        });
    });

    // #endregion setSystemSettings

    // -----------------------------------------------------------------------------------------
    // #region setUnauthenticated
    // -----------------------------------------------------------------------------------------

    describe("setUnauthenticated", () => {
        test("when currentUserLogin is set, returns with currentUserLogin undefined", () => {
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord
            );
            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                ).setUnauthenticated().currentIdentity
            ).toBeUndefined();
        });

        test("when currentUserLogin is set, returns with isAuthenticated false", () => {
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord
            );
            expect(
                Factory.build<GlobalStateRecord>(
                    FactoryType.globalStateRecord,
                    {
                        currentIdentity: identity,
                    }
                )
                    .setUnauthenticated()
                    .isAuthenticated()
            ).toBeFalse();
        });
    }); // end setUnauthenticated

    // #endregion setUnauthenticated
}); // end GlobalStateRecord
