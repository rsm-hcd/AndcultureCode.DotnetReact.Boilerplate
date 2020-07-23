import { Record } from "immutable";
import File from "models/interfaces/file";
import PathUtils from "utilities/path-utils";

const defaultValues: File = {
    createdById: undefined,
    createdOn: undefined,
    deletedById: undefined,
    deletedOn: undefined,
    id: undefined,
    relativeProviderPath: "",
    storageContainer: undefined,
    updatedById: undefined,
    updatedOn: undefined,
};

export default class FileRecord extends Record(defaultValues) implements File {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // #endregion Properties

    // -------------------------------------------------------------------------------------------------
    // #region Constructor
    // -------------------------------------------------------------------------------------------------

    constructor(params?: File) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        super(params);
    }

    // #endregion Constructor

    // -------------------------------------------------------------------------------------------------
    // #region Public Methods
    // -------------------------------------------------------------------------------------------------

    public fileName(): string {
        return PathUtils.relativePathToFilename(this.relativeProviderPath);
    }

    /**
     * Return the resource type label associated with the file extension
     * for the file path, for example, .docx => "Document", .jpg => "Image"
     */
    public resourceType(): string {
        return PathUtils.fileTypeLabelFromPath(this.relativeProviderPath);
    }

    public with(values: Partial<File>): FileRecord {
        return new FileRecord(Object.assign(this.toJS(), values));
    }

    // #endregion Public Methods
}
