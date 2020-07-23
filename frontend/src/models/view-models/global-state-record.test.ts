import GlobalStateRecord from "models/view-models/global-state-record";
import IdentityRecord from "models/view-models/identity-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

describe("GlobalStateRecord", () => {
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
    });

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
    });

    // #endregion setIdentity

    // -----------------------------------------------------------------------------------------
    // #region setUnauthenticated
    // -----------------------------------------------------------------------------------------

    describe("setUnauthenticated", () => {
        test("when currentIdentity is set, returns with currentIdentity undefined", () => {
            // Arrange
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord
            );
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                {
                    currentIdentity: identity,
                }
            );

            // Act
            const result = sut.setUnauthenticated();

            // Assert
            expect(result.currentIdentity).toBeUndefined();
        });

        test("when currentIdentity is set, returns with currentIdentity false", () => {
            // Arrange
            const identity = Factory.build<IdentityRecord>(
                FactoryType.identityRecord
            );
            const sut = Factory.build<GlobalStateRecord>(
                FactoryType.globalStateRecord,
                {
                    currentIdentity: identity,
                }
            );

            // Act
            const result = sut.setUnauthenticated().isAuthenticated();

            // Assert
            expect(result).toBeFalse();
        });
    });

    // #endregion setUnauthenticated
});
