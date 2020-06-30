import RemoteAccessDetailsRecord from "models/view-models/remote-access-details-record";
import FileUploadDestination from "utilities/enumerations/file-upload-destination";
import ServiceFactory from "utilities/services/service-factory";
import ServiceHookFactory from "utilities/services/service-hook-factory";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface RemoteAccessDetailsQueryParams {
    relativeProviderPath: string;
    contentType?: string;
    fileUploadDestination?: FileUploadDestination;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const baseEndpoint = "remoteaccessdetails";
const resourceType = RemoteAccessDetailsRecord;

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Service
// -------------------------------------------------------------------------------------------------

const RemoteAccessDetailsService = {
    /**
     * Get a PreSignedUrl to delete an S3 resource
     */
    delete: ServiceFactory.get<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/delete`),
    /**
     * React hook wrapper for delete
     */
    useDelete: ServiceHookFactory.useGet<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/delete`),
    /**
     * Get a PreSignedUrl to an S3 resource
     */
    get: ServiceFactory.get<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, baseEndpoint),
    /**
     * React hook wrapper for get
     */
    useGet: ServiceHookFactory.useGet<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, baseEndpoint),
    getHead: ServiceFactory.get<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/head`),
    useGetHead: ServiceHookFactory.useGet<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/head`),
    /**
     * Check whether an S3 resource exists
     */
    exists: ServiceFactory.get<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/exists`),
    /**
     * React hook wrapper for exists
     */
    useExists: ServiceHookFactory.useGet<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/exists`),
    /**
     * Get a PreSignedUrl to upload to a User's
     * S3 repository
     */
    upload: ServiceFactory.get<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/upload`),
    /**
     * React hook wrapper for userUpload
     */
    useUpload: ServiceHookFactory.useGet<
        RemoteAccessDetailsRecord,
        undefined,
        RemoteAccessDetailsQueryParams
    >(resourceType, `${baseEndpoint}/upload`),
};

// #endregion Service

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default RemoteAccessDetailsService;

// #endregion Exports
