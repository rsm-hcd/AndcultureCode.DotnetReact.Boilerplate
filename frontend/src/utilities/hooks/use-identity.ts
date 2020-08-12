// import IdentityRecord from "models/view-models/identity-record";
// import UserLoginRecord from "models/view-models/user-login-record";
// import { useCallback } from "react";
// import RoleService from "utilities/services/roles/role-service";
// import UserRoleService from "utilities/services/users/user-roles/user-role-service";
// import UserService from "utilities/services/users/user-service";
// import UserRoleRecord from "models/view-models/user-role-record";
// import UserRoleGroupRecord from "models/view-models/user-role-group-record";
// import UserLoginService from "utilities/services/user-logins/user-login-service";

// /**
//  * Custom hook providing utility functions for the current identity of the user
//  */
// export default function useIdentity() {
//     const { get: getUserApi } = UserService.useGet();
//     const { get: getUserLoginApi } = UserLoginService.useGet();
//     const { list: listUserRolesApi } = UserRoleService.useList();
//     const { list: listRolesApi } = RoleService.useList();

//     /**
//      * Build the identity record including the current User, UserLogin and UserRoles
//      *
//      * @param  {UserLoginRecord|undefined} (userLogin
//      * @returns Promise
//      */
//     const buildCurrentIdentity = useCallback(
//         (userLogin: UserLoginRecord | undefined) => {
//             const getIdentity = async (
//                 userLogin: UserLoginRecord
//             ): Promise<IdentityRecord | undefined> => {
//                 const userLoginResponse = await getUserLoginApi({
//                     id: userLogin.id!,
//                 });

//                 const userResponse = await getUserApi({
//                     id: userLogin.userId!,
//                 });
//                 const rolesResponse = await listRolesApi();
//                 const userRolesResponse = await listUserRolesApi({
//                     userId: userLogin.userId!,
//                 });

//                 if (userResponse.result!.hasErrors()) {
//                     return;
//                 }

//                 const updatedUserLogin = userLoginResponse.resultObject;
//                 const user = userResponse.resultObject;
//                 const roles = rolesResponse.resultObjects;
//                 const userRoles = userRolesResponse.resultObjects;

//                 // For now, we can't depend on everyone having roles.
//                 // Eventually we will want to refrain from setting identity
//                 // if there are no roles
//                 if (roles == null || userRoles == null) {
//                     return new IdentityRecord({
//                         user,
//                         userLogin: updatedUserLogin,
//                         userRoles: [],
//                     });
//                 }

//                 const userLoginWithRoles = updatedUserLogin
//                     ?.withRole(roles)
//                     .withUserRole(userRoles);

//                 const identityRecord = new IdentityRecord({
//                     user,
//                     userLogin: userLoginWithRoles,
//                 });

//                 return identityRecord;
//             };
//             if (userLogin == null) {
//                 return;
//             }

//             return getIdentity(userLogin);
//         },
//         [getUserApi, getUserLoginApi, listRolesApi, listUserRolesApi]
//     );

//     return { buildCurrentIdentity };
// }

export default {};
