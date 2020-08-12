import UserRecord from "models/view-models/user-record";
import {
    ServiceFactory,
    ServiceHookFactory,
} from "andculturecode-javascript-react";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface UserIndexQueryParams {}

export interface UserResourcePathParams {
    id: number;
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
    get: ServiceFactory.get<UserRecord, UserResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),
    list: ServiceFactory.list<UserRecord, UserIndexQueryParams>(
        resourceType,
        baseEndpoint
    ),
    useGet: ServiceHookFactory.useGet<UserRecord, UserResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),
    useList: ServiceHookFactory.useList<UserRecord, UserIndexQueryParams>(
        resourceType,
        baseEndpoint
    ),
};

// #endregion Service

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default UserService;

// #endregion Exports
