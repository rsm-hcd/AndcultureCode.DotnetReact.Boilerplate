import UserLoginRecord from "models/view-models/user-login-record";
import {
    ServiceFactory,
    ServiceHookFactory,
} from "andculturecode-javascript-react";

export interface UserLoginPathParams {}

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const baseEndpoint = "userlogins";
const baseEndpointFromCookie = `${baseEndpoint}/cookie`;
const resourceType = UserLoginRecord;
const resourceEndpoint = `${baseEndpoint}/:id`;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Service
// -----------------------------------------------------------------------------------------

const UserLoginService = {
    /**
     * Create a new user
     */
    create: ServiceFactory.create(resourceType, baseEndpoint),

    /**
     * Soft delete a user entity
     */
    delete: ServiceFactory.delete(resourceEndpoint),

    /**
     * Custom hook for leveraging service create calls in react components
     */
    useCreate: ServiceHookFactory.useCreate(resourceType, baseEndpoint),

    /**
     * Custom hook for leveraging service delete calls in react components
     */
    useDelete: ServiceHookFactory.useDelete(resourceEndpoint),

    /**
     * Attempts to locate the user's current login via the cookie.
     * When successful a UserLogin was found
     */
    useGetFromCookie: ServiceHookFactory.useGet<
        UserLoginRecord,
        UserLoginPathParams
    >(resourceType, baseEndpointFromCookie),
};

// #endregion Service

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default UserLoginService;

// #endregion Exports
