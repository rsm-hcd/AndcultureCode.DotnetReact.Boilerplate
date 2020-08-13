import Faker from "faker";
import IdentityRecord from "models/view-models/identity-record";
import RoleRecord from "models/view-models/role-record";
import UserRecord from "models/view-models/user-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import LocalStorageKey from "utilities/enumerations/local-storage-keys";
import { LocalStorageUtils } from "utilities/local-storage-utils";
import moment from "moment";
import { TestUtils } from "utilities/test-utils";
import RoleType from "utilities/enumerations/role-type";
import { nameof } from "ts-simple-nameof";
import { Identity } from "models/interfaces/identity";

describe(nameof(IdentityRecord), () => {
    // -----------------------------------------------------------------------------------------
    // #region Constructor
    // -----------------------------------------------------------------------------------------

    describe("Constructor", () => {
        test("when given 'role' in params object that is not an instance of RoleRecord, it instantiates a new RoleRecord", () => {
            // Arrange & Act
            const role = Factory.build<RoleRecord>(FactoryType.roleRecord);
            const sut = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                {
                    role: role.toJS() as RoleRecord,
                } // This is the important setup
            );

            // Assert
            expect(sut.role).not.toBeNull();
            expect(sut.role).toBeInstanceOf(RoleRecord);
        });

        test("when given 'user' in params object that is not an instance of UserRecord, it instantiates a new UserRecord", () => {
            // Arrange & Act
            const user = Factory.build<UserRecord>(FactoryType.userRecord);
            const sut = Factory.build<IdentityRecord>(
                FactoryType.identityRecord,
                {
                    user: user.toJS() as UserRecord,
                } // This is the important setup
            );

            // Assert
            expect(sut.user).not.toBeNull();
            expect(sut.user).toBeInstanceOf(UserRecord);
        });
    });

    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region refreshLocalStorage
    // -----------------------------------------------------------------------------------------

    describe("refreshLocalStorage", () => {
        describe("when identity is valid", () => {
            test("should update local storage to new identity", () => {
                // Arrange

                const initial = Factory.build<IdentityRecord>(
                    FactoryType.identityRecord
                );
                LocalStorageUtils.set<IdentityRecord>(
                    LocalStorageKey.Identity,
                    initial
                );
                const userId = Faker.random.number();
                const user = Factory.build<UserRecord>(FactoryType.user, {
                    id: userId,
                });

                const newIdentity = Factory.build<IdentityRecord>(
                    FactoryType.identityRecord,
                    { user }
                );
                // Act
                newIdentity.refreshLocalStorage();
                const result = LocalStorageUtils.get<IdentityRecord>(
                    LocalStorageKey.Identity,
                    IdentityRecord
                );

                // Assert
                expect(result).not.toBe(undefined);
                expect(result!.user!.id).toBe(userId);
            });
        });
    });

    // #endregion refreshLocalStorage

    // -----------------------------------------------------------------------------------------
    // #region userId
    // -----------------------------------------------------------------------------------------

    describe("userId", () => {
        describe("when user record is undefined", () => {
            test("should return 0", () => {
                const sut = Factory.build<IdentityRecord>(
                    FactoryType.identityRecord
                );
                expect(sut.userId()).toBe(0);
            });
        });

        describe("when user record exists but id is undefined ", () => {
            test("should return 0", () => {
                const user = Factory.build<UserRecord>(FactoryType.userRecord);
                const sut = Factory.build<IdentityRecord>(
                    FactoryType.identityRecord,
                    { user }
                );
                expect(sut.userId()).toBe(0);
            });
        });

        describe("when user record is valid and exists", () => {
            test("should return id", () => {
                const userId = Faker.random.number();
                const user = Factory.build<UserRecord>(FactoryType.userRecord, {
                    id: userId,
                });
                const sut = Factory.build<IdentityRecord>(
                    FactoryType.identityRecord,
                    { user }
                );
                expect(sut.userId()).toBe(userId);
            });
        });
    });

    // #endregion userId
});
