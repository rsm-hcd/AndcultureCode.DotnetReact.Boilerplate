import RoleRecord from "models/view-models/role-record";
import {
    ServiceFactory,
    ServiceHookFactory,
} from "andculturecode-javascript-react";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface RoleIndexQueryParams {}

export interface RoleResourcePathParams {
    id: number;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const baseEndpoint = "roles";
const resourceType = RoleRecord;
const resourceEndpoint = `${baseEndpoint}/:id`;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Service
// -----------------------------------------------------------------------------------------

const RoleService = {
    get: ServiceFactory.get<RoleRecord, RoleResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),
    list: ServiceFactory.list<RoleRecord, RoleIndexQueryParams>(
        resourceType,
        baseEndpoint
    ),
    useGet: ServiceHookFactory.useGet<RoleRecord, RoleResourcePathParams>(
        resourceType,
        resourceEndpoint
    ),
    useList: ServiceHookFactory.useList<RoleRecord, RoleIndexQueryParams>(
        resourceType,
        baseEndpoint
    ),
};

// #endregion Service

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default RoleService;

// #endregion Exports
