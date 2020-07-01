import UserRecord from "models/view-models/user-record";
import ServiceFactory from "utilities/services/service-factory";
import ServiceHookFactory from "utilities/services/service-hook-factory";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface UserBasePathParams {}

export interface UserResourcePathParams extends UserBasePathParams {
    id: number;
}

/**
 * Search parameters when listing User resources
 * These get translated to QueryString parameters
 */
export interface UserListQueryParams {
    /**
     * An array of userIds to filter by.
     */
    ids: number[];
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const baseEndpoint = "users";
const resourceType = UserRecord;
const resourceEndpoint = `${baseEndpoint}/:id`;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Service
// -----------------------------------------------------------------------------------------

const UserService = {
    /**
     * Create a new user
     */
    create: ServiceFactory.create(resourceType, baseEndpoint),

    /**
     * Soft delete a user entity
     */
    delete: ServiceFactory.delete(resourceEndpoint),

    /**
     * Retrieve a user by id
     */
    get: ServiceFactory.get<UserRecord, UserResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),

    /**
     * Retrieve a a list of all users matching given parameters
     */
    list: ServiceFactory.list<UserRecord, UserListQueryParams>(
        resourceType,
        baseEndpoint
    ),

    /**
     * Update user details
     */
    update: ServiceFactory.update(resourceType, resourceEndpoint),

    /**
     * Custom hook for leveraging service create calls in react components
     */
    useCreate: ServiceHookFactory.useCreate(resourceType, baseEndpoint),

    /**
     * Custom hook for leveraging service delete calls in react components
     */
    useDelete: ServiceHookFactory.useDelete(resourceEndpoint),

    /**
     * Custom hook for leveraging service get calls in react components
     */
    useGet: ServiceHookFactory.useGet<UserRecord, UserResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),

    /**
     * Custom hook for leveraging service list calls in react components
     */
    useList: ServiceHookFactory.useList<UserRecord, UserListQueryParams>(
        resourceType,
        baseEndpoint
    ),

    /**
     * Custom hook for leveraging service update calls in react components
     */
    useUpdate: ServiceHookFactory.useUpdate<UserRecord, UserResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),
};

// #endregion Service

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default UserService;

// #endregion Exports
