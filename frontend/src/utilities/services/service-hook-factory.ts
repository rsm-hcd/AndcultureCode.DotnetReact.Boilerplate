/**
 * Disabling eslint rule as currently it does not support currying of custom hooks
 * and thinks we are calling it
 */
/* eslint-disable react-hooks/rules-of-hooks */
import ServiceFactory, {
    GetService,
    UpdateService,
    ListService,
    NestedListService,
    NestedCreateService,
    DeleteService,
    CreateService,
    BulkUpdateService,
} from "utilities/services/service-factory";
import ServiceResponse from "utilities/interfaces/service-response";
import useCancellablePromise from "utilities/hooks/use-cancellable";
import { useCallback } from "react";

// -----------------------------------------------------------------------------------------
// #region Types
// -----------------------------------------------------------------------------------------

/**
 * Type defining the return object from calling `useBulkUpdate()`
 */
export type BulkUpdateServiceHook<TRecord, TPathParams> = () => {
    update: BulkUpdateService<TRecord, TPathParams>;
};

/**
 * Type defining the return object from calling `useCreate()`
 */
export type CreateServiceHook<TRecord> = () => {
    create: CreateService<TRecord>;
};

/**
 * Type defining the return object from calling `useDelete()`
 */
export type DeleteServiceHook = () => {
    delete: DeleteService;
};

/**
 * Type defining the return object from calling `useGet()`
 */
export type GetServiceHook<
    TRecord,
    TPathParams,
    TQueryParams = undefined
> = () => {
    get: GetService<TRecord, TPathParams, TQueryParams>;
};

/**
 * Type defining the return object from calling `useList()`
 */
export type ListServiceHook<TRecord, TQueryParams> = () => {
    list: ListService<TRecord, TQueryParams>;
};

/**
 * Type defining the return object from calling `useNestedCreate()`
 */
export type NestedCreateServiceHook<TRecord, TPathParams> = () => {
    create: NestedCreateService<TRecord, TPathParams>;
};

/**
 * Type defining the return object from calling `useNestedList()`
 */
export type NestedListServiceHook<TRecord, TPathParams, TQueryParams> = () => {
    list: NestedListService<TRecord, TPathParams, TQueryParams>;
};

/**
 * Type defining the return object from calling `useUpdate()`
 */
export type UpdateServiceHook<TRecord, TPathParams> = () => {
    update: UpdateService<TRecord, TPathParams>;
};

// #endregion Types

// ---------------------------------------------------------------------------------------------
// #region Functions
// ---------------------------------------------------------------------------------------------

/**
 * Factory to encapsulate common service function logic
 */
const ServiceHookFactory = {
    /**
     * Creates conventional hook for using service create function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     *
     * ### Recommendation
     * Use `useNestedCreate` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    useCreate<TRecord extends any>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): CreateServiceHook<TRecord> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceCreate = ServiceFactory.create(
                recordType,
                baseEndpoint
            );

            function create(
                record?: TRecord
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(serviceCreate(record)) as Promise<
                    ServiceResponse<TRecord>
                >;
            }

            return { create: useCallback(create, []) };
        };
    },

    /**
     * Creates conventional hook for using service delete function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useDelete<TPathParams extends any>(
        resourceEndpoint: string
    ): DeleteServiceHook {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceDelete = ServiceFactory.delete<TPathParams>(
                resourceEndpoint
            );

            function _delete(
                id: number,
                pathParams?: any
            ): Promise<ServiceResponse<Boolean>> {
                return cancellablePromise(
                    serviceDelete(id, pathParams)
                ) as Promise<ServiceResponse<Boolean>>;
            }

            return { delete: useCallback(_delete, []) };
        };
    },

    /**
     * Creates conventional hook for using service get function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param resourceEndpoint
     */
    useGet<TRecord, TPathParams, TQueryParams = undefined>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): GetServiceHook<TRecord, TPathParams, TQueryParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceGet = ServiceFactory.get<
                TRecord,
                TPathParams,
                TQueryParams
            >(recordType, resourceEndpoint);

            function get(
                pathParams: TPathParams,
                queryParams?: TQueryParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(
                    serviceGet(pathParams, queryParams)
                ) as Promise<ServiceResponse<TRecord>>;
            }

            return { get: useCallback(get, []) };
        };
    },

    /**
     * Creates conventional hook for using service list function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     *
     * ### Recommendation
     * Use `useNestedList` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    useList<TRecord, TQueryParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): ListServiceHook<TRecord, TQueryParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceList = ServiceFactory.list<TRecord, TQueryParams>(
                recordType,
                baseEndpoint
            );

            function list(
                queryParams?: TQueryParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(serviceList(queryParams)) as Promise<
                    ServiceResponse<TRecord>
                >;
            }

            return { list: useCallback(list, []) };
        };
    },

    /**
     * Creates conventional hook for using service nested create function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useNestedCreate<TRecord extends any, TPathParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): NestedCreateServiceHook<TRecord, TPathParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceCreate = ServiceFactory.nestedCreate<
                TRecord,
                TPathParams
            >(recordType, baseEndpoint);

            function create(
                record: TRecord,
                pathParams: TPathParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(
                    serviceCreate(record, pathParams)
                ) as Promise<ServiceResponse<TRecord>>;
            }

            return { create: useCallback(create, []) };
        };
    },

    /**
     * Creates conventional hook for using service nested list function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useNestedList<TRecord, TPathParams, TQueryParams>(
        recordType: { new (): TRecord },
        baseEndpoint: string
    ): NestedListServiceHook<TRecord, TPathParams, TQueryParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceList = ServiceFactory.nestedList<
                TRecord,
                TPathParams,
                TQueryParams
            >(recordType, baseEndpoint);

            function list(
                pathParams: TPathParams,
                queryParams?: TQueryParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(
                    serviceList(pathParams, queryParams)
                ) as Promise<ServiceResponse<TRecord>>;
            }

            return { list: useCallback(list, []) };
        };
    },

    /**
     * Creates conventional hook for using service update function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useUpdate<TRecord, TPathParams>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): UpdateServiceHook<TRecord, TPathParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceUpdate = ServiceFactory.update(
                recordType,
                resourceEndpoint
            );

            function update(
                record: TRecord,
                pathParams?: TPathParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(
                    serviceUpdate(record, pathParams)
                ) as Promise<ServiceResponse<TRecord>>;
            }

            return { update: useCallback(update, []) };
        };
    },

    /**
     * Creates conventional hook for using service update function for an array of the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param resourceEndpoint
     */
    useBulkUpdate<TRecord, TPathParams>(
        recordType: { new (): TRecord },
        resourceEndpoint: string
    ): BulkUpdateServiceHook<TRecord, TPathParams> {
        return () => {
            const { cancellablePromise } = useCancellablePromise();

            const serviceUpdate = ServiceFactory.bulkUpdate(
                recordType,
                resourceEndpoint
            );

            function update(
                records: Array<TRecord>,
                pathParams: TPathParams
            ): Promise<ServiceResponse<TRecord>> {
                return cancellablePromise(
                    serviceUpdate(records, pathParams)
                ) as Promise<ServiceResponse<TRecord>>;
            }

            return { update: useCallback(update, []) };
        };
    },
};

// #endregion Functions

// ---------------------------------------------------------------------------------------------
// #region Exports
// ---------------------------------------------------------------------------------------------

export default ServiceHookFactory;

// #endregion Exports
