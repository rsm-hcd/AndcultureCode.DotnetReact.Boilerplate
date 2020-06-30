import { Record } from "immutable";
import RemoteAccessDetails from "models/interfaces/remote-access-details";

const defaultValues: RemoteAccessDetails = {
    url: "",
};

export default class RemoteAccessDetailsRecord extends Record(defaultValues)
    implements RemoteAccessDetails {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // #endregion Properties

    // -------------------------------------------------------------------------------------------------
    // #region Constructor
    // -------------------------------------------------------------------------------------------------

    constructor(params?: RemoteAccessDetails) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        super(params);
    }

    // #endregion Constructor

    // -------------------------------------------------------------------------------------------------
    // #region Public Methods
    // -------------------------------------------------------------------------------------------------

    public with(
        values: Partial<RemoteAccessDetails>
    ): RemoteAccessDetailsRecord {
        return new RemoteAccessDetailsRecord(
            Object.assign(this.toJS(), values)
        );
    }

    // #endregion Public Methods
}
