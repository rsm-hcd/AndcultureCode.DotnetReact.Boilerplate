import UserLoginRecord from "models/view-models/user-login-record";
import UserRoleRecord from "models/view-models/user-role-record";
import { LocalStorageUtils } from "utilities/local-storage-utils";

describe("LocalStorageUtils", () => {
    let record = new UserLoginRecord();
    const userloginKey = "USER_LOGIN_KEY";
    beforeEach(() => {
        localStorage.clear();

        record = new UserLoginRecord({
            id: 1,
            userId: 1,
            keepAliveOn: "false",
            userName: "test@test.com",
            password: "",
            roleId: 1,
        });
    });

    describe("get", () => {
        test("should return UserLoginRecord", () => {
            // Arrange
            LocalStorageUtils.set<UserLoginRecord>(userloginKey, record);

            // Act
            const result = LocalStorageUtils.get<UserLoginRecord>(
                userloginKey,
                UserLoginRecord
            );
            // Assert
            expect(result).not.toBeUndefined();
            expect(result).toBeInstanceOf(UserLoginRecord);
        });

        test("should return array of integers", () => {
            // Arrange
            LocalStorageUtils.set<number[]>("numbers", [1, 2, 3, 4]);

            // Act
            const result = LocalStorageUtils.get<number[]>("numbers");

            // Assert
            expect(result).toBeInstanceOf(Array);
            expect(typeof result![0]).toBe("number");
            expect(result!.length).toBe(4);
        });
    });

    describe("getArray", () => {
        test("should return Array of Records", () => {
            // Arrange
            let roles: UserRoleRecord[] = new Array<UserRoleRecord>();

            for (let i = 0; i < 5; i++) {
                roles.push(
                    new UserRoleRecord({
                        userId: i,
                        roleId: 1,
                        eulaAccepted: false,
                    })
                );
            }

            LocalStorageUtils.set<UserRoleRecord[]>(userloginKey, roles);

            // Act
            const result = LocalStorageUtils.getArray<UserRoleRecord>(
                userloginKey,
                UserRoleRecord
            );

            // Assert
            expect(result).not.toBeUndefined();
            expect(result).toBeInstanceOf(Array);
            expect(result![0]).toBeInstanceOf(UserRoleRecord);
            expect(result!.length).toBe(5);
        });
    });

    describe("set", () => {
        test("should set object to local storage", () => {
            // Act
            LocalStorageUtils.set<UserLoginRecord>(userloginKey, record);
            const result = localStorage.getItem(userloginKey);

            // Assert
            expect(result).not.toBeNull();
        });
    });

    describe("remove", () => {
        test("should remove object", () => {
            // Arrange
            LocalStorageUtils.set<UserLoginRecord>(userloginKey, record);

            // Act
            LocalStorageUtils.remove(userloginKey);

            // Assert
            expect(localStorage.length).toBe(0);
        });
    });
});
