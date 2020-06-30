import axios from "axios";
import ServiceResponse from "utilities/interfaces/service-response";
import { RouteUtils } from "utilities/route-utils";
import ServiceUtils from "utilities/service-utils";

// -----------------------------------------------------------------------------------------
// #region Types
// -----------------------------------------------------------------------------------------

/**
 * Type defining the service function for bulk updating the supplied resource type
 */
export type BulkUpdateService<TRecord, TPathParams> = (
    records: Array<TRecord>,
    pathParams: TPathParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for creating the supplied resource type
 */
export type CreateService<TRecord> = (
    record?: TRecord
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for deleting the supplied resource
 */
export type DeleteService = (
    id: number,
    pathParams?: any
) => Promise<ServiceResponse<Boolean>>;

/**
 * Type defining the service function for getting the supplied resource type
 */
export type GetService<TRecord, TPathParams, TQueryParams = undefined> = (
    pathParams: TPathParams,
    queryParams?: TQueryParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for listing resources by supplied type
 */
export type ListService<TRecord, TQueryParams> = (
    queryParams?: TQueryParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for creating the supplied resource type when resource is nested
 */
export type NestedCreateService<TRecord, TPathParams> = (
    record: TRecord,
    pathParams: TPathParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for listing resources by supplied type when resource is nested
 */
export type NestedListService<TRecord, TPathParams, TQueryParams> = (
    pathParams: TPathParams,
    queryParams?: TQueryParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for updating the supplied resource type
 */
export type UpdateService<TRecord, TPathParams> = (
    record: TRecord,
    pathParams?: TPathParams
) => Promise<ServiceResponse<TRecord>>;

// #endregion Types

// ---------------------------------------------------------------------------------------------
// #region Public Functions
// ---------------------------------------------------------------------------------------------

/**
 * Factory to encapsulate common service function logic
 */
const ServiceFactory = {
    /**
     * Creates conventional Service Create function for the supplied resource type
     *
     * ### Recommendation
     * Use `nestedCreate` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    create<TRecord extends any>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): CreateService<TRecord> {
        return async (record?: TRecord) =>
            await _create<TRecord>(recordType, baseEndpoint, record);
    },

    /**
     * Creates conventional Service Delete function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    delete<TPathParams extends any>(resourceEndpoint: string): DeleteService {
        return async (id: number, pathParams?: TPathParams) =>
            await _delete(id, resourceEndpoint, pathParams);
    },

    /**
     * Creates conventional Service Get function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    get<TRecord, TPathParams, TQueryParams = undefined>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): GetService<TRecord, TPathParams, TQueryParams> {
        return async (pathParams: TPathParams, queryParams?: TQueryParams) =>
            await _get<TRecord, TPathParams, TQueryParams>(
                recordType,
                resourceEndpoint,
                pathParams,
                queryParams
            );
    },

    /**
     * Creates conventional Service List function for the supplied resource type
     *
     * ### Recommendation
     * Use `nestedList` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    list<TRecord, TQueryParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): ListService<TRecord, TQueryParams> {
        return async (queryParams?: TQueryParams) =>
            await _list<TRecord>(recordType, baseEndpoint, null, queryParams);
    },

    /**
     * Creates conventional Service Create function for the supplied resource type
     * when the resource is nested
     * @param recordType
     * @param baseEndpoint
     */
    nestedCreate<TRecord extends any, TPathParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): NestedCreateService<TRecord, TPathParams> {
        return async (record: TRecord, pathParams: TPathParams) => {
            const url = RouteUtils.getUrl(baseEndpoint, pathParams);
            return await _create<TRecord>(recordType, url, record);
        };
    },

    /**
     * Creates conventional Service List function for the supplied resource type
     * @param recordType
     * @param baseEndpoint
     */
    nestedList<TRecord, TPathParams, TQueryParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): NestedListService<TRecord, TPathParams, TQueryParams> {
        return async (pathParams: TPathParams, queryParams?: TQueryParams) =>
            await _list<TRecord>(
                recordType,
                baseEndpoint,
                pathParams,
                queryParams
            );
    },

    /**
     * Creates conventional Service Update function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    update<TRecord extends any, TPathParams extends any>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): UpdateService<TRecord, TPathParams> {
        return async (record: TRecord, pathParams?: any) =>
            await _update<TRecord, TPathParams>(
                recordType,
                record,
                resourceEndpoint,
                pathParams
            );
    },

    /**
     * Creates a conventional Service Update function for an Array of the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    bulkUpdate<TRecord extends any, TPathParams extends any>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): BulkUpdateService<TRecord, TPathParams> {
        return async (records: Array<TRecord>, pathParams?: any) =>
            await _bulkUpdate<TRecord, TPathParams>(
                recordType,
                records,
                resourceEndpoint,
                pathParams
            );
    },
};

// #endregion Public Functions

// ---------------------------------------------------------------------------------------------
// #region Private Functions
// ---------------------------------------------------------------------------------------------

const _buildUrl = (id: number, resourceEndpoint: string, pathParams?: any) => {
    if (pathParams == null) {
        pathParams = {};
    }
    pathParams = Object.assign(pathParams, { id });
    return RouteUtils.getUrl(resourceEndpoint, pathParams);
};

const _create = async function<TRecord extends any>(
    recordType: { new (): TRecord },
    url: string,
    record?: TRecord
) {
    const requestData = record != null ? record.toJS() : null;

    return await axios
        .post(url, requestData)
        .then((r) => ServiceUtils.mapAxiosResponse(recordType, r));
};

const _delete = async function(
    id: number,
    resourceEndpoint: string,
    pathParams?: any
) {
    const url = _buildUrl(id, resourceEndpoint, pathParams);
    return await axios
        .delete(url)
        .then((r) => ServiceUtils.mapAxiosResponse(Boolean, r));
};

const _get = async function<TRecord, TPathParams, TQueryParams = undefined>(
    recordType: { new (): TRecord },
    resourceEndpoint: string,
    pathParams: TPathParams,
    queryParams?: TQueryParams
) {
    const url = RouteUtils.getUrl(resourceEndpoint, pathParams, queryParams);
    return await axios
        .get(url)
        .then((r) => ServiceUtils.mapAxiosResponse(recordType, r));
};

const _list = async function<TRecord extends any>(
    recordType: { new (): TRecord },
    baseEndpoint: string,
    pathParams?: any,
    queryParams?: any
) {
    const url = RouteUtils.getUrl(baseEndpoint, pathParams, queryParams);
    return await axios
        .get(url)
        .then((r) => ServiceUtils.mapPagedAxiosResponse(recordType, r));
};

const _update = async function<TRecord extends any, TPathParams extends any>(
    recordType: { new (): TRecord },
    record: TRecord,
    resourceEndpoint: string,
    pathParams?: TPathParams
) {
    const url = _buildUrl(record.id, resourceEndpoint, pathParams);
    return await axios
        .put(url, record.toJS())
        .then((r) => ServiceUtils.mapAxiosResponse(recordType, r));
};

const _bulkUpdate = async function<
    TRecord extends any,
    TPathParams extends any
>(
    recordType: { new (): TRecord },
    records: Array<TRecord>,
    resourceEndpoint: string,
    pathParams: TPathParams
) {
    const url = RouteUtils.getUrl(resourceEndpoint, pathParams);
    return await axios
        .put(
            url,
            records.map((r: TRecord) => r.toJS())
        )
        .then((r) => ServiceUtils.mapPagedAxiosResponse(recordType, r));
};

// #endregion Private Functions

// ---------------------------------------------------------------------------------------------
// #region Exports
// ---------------------------------------------------------------------------------------------

export default ServiceFactory;

// #endregion Exports
