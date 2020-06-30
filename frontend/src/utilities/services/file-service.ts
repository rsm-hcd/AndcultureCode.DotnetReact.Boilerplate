import FileRecord from "models/view-models/file-record";
import ServiceFactory from "utilities/services/service-factory";
import ServiceHookFactory from "utilities/services/service-hook-factory";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface FilePathParams {
    id: number;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const baseEndpoint = "files";
const resourceType = FileRecord;

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Service
// -------------------------------------------------------------------------------------------------

const FileService = {
    create: ServiceFactory.create<FileRecord>(resourceType, baseEndpoint),
    useCreate: ServiceHookFactory.useCreate<FileRecord>(
        resourceType,
        baseEndpoint
    ),
    delete: ServiceFactory.delete(`${baseEndpoint}/:id`),
    useDelete: ServiceHookFactory.useDelete(`${baseEndpoint}/:id`),
    get: ServiceFactory.get<FileRecord, FilePathParams>(
        resourceType,
        `${baseEndpoint}/:id`
    ),
    useGet: ServiceHookFactory.useGet<FileRecord, FilePathParams>(
        resourceType,
        `${baseEndpoint}/:id`
    ),
};

// #endregion Service

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default FileService;

// #endregion Exports
