import IdentityRecord from "models/view-models/identity-record";
import { useCallback } from "react";
import UserLoginRecord from "models/view-models/user-login-record";
import RoleService from "utilities/services/role-service";
import UserService from "utilities/services/user-service";
import UserRecord from "models/view-models/user-record";
import RoleRecord from "models/view-models/role-record";

/**
 * Custom hook providing utility functions for the current identity of the user
 */
export default function useIdentity() {
    const { get: getRoleApi } = RoleService.useGet();
    const { get: getUserApi } = UserService.useGet();

    /**
     * Build the identity record including the current User and Role
     *
     * @param  {UserLoginRecord|undefined} (userLogin
     * @returns Promise
     */
    const getHook = (userLogin: UserLoginRecord | undefined) => {
        if (userLogin == null) {
            return;
        }

        return getIdentity(userLogin);
    };

    const getIdentity = async (
        userLogin: UserLoginRecord
    ): Promise<IdentityRecord | undefined> => {
        const role = await getRole(userLogin?.roleId);
        const user = await getUser(userLogin?.userId);

        if (user == null) {
            return;
        }

        return new IdentityRecord({ role, user });
    };

    const getRole = async (
        roleId: number | undefined
    ): Promise<RoleRecord | undefined> => {
        if (roleId == null) {
            return;
        }

        return (await getRoleApi({ id: roleId })).result?.resultObject;
    };

    const getUser = async (
        userId: number | undefined
    ): Promise<UserRecord | undefined> => {
        if (userId == null) {
            return;
        }

        return (await getUserApi({ id: userId })).result?.resultObject;
    };

    return { getIdentity: useCallback(getHook, [getRoleApi, getUserApi]) };
}
