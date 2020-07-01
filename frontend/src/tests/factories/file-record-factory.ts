import FileRecord from "models/view-models/file-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------

export const fileRecordFactory = Factory.define<FileRecord>(
    FactoryType.fileRecord,
    FileRecord
)
    .sequence(
        "relativeProviderPath",
        (i: number) => `/relativeProviderPath-${i}/default.csv`
    )
    .sequence("storageContainer", (i: number) => `storagecontainer-${i}`)
    .sequence("resourceType", () => "default");

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default fileRecordFactory;

// #endregion Export
