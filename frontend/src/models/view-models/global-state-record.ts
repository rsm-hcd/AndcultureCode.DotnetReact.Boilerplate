import { Record } from "immutable";
import GlobalState from "models/interfaces/global-state";
import IdentityRecord from "models/view-models/identity-record";
import { ResultRecord } from "andculturecode-javascript-core";
import LocalStorageKey from "utilities/enumerations/local-storage-keys";
import { LocalStorageUtils } from "utilities/local-storage-utils";

const defaultValues: GlobalState = {
    currentIdentity: undefined,
    unauthorizedResult: undefined,
};

export default class GlobalStateRecord extends Record(defaultValues)
    implements GlobalState {
    // ---------------------------------------------------------------------------------------------
    // #region Properties
    // ---------------------------------------------------------------------------------------------

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // #endregion Properties

    // ---------------------------------------------------------------------------------------------
    // #region Constructor
    // ---------------------------------------------------------------------------------------------

    constructor(params?: GlobalState) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        if (
            params.currentIdentity != null &&
            !(params.currentIdentity instanceof IdentityRecord)
        ) {
            params.currentIdentity = new IdentityRecord(params.currentIdentity);
        }

        if (
            params.unauthorizedResult != null &&
            !(params.unauthorizedResult instanceof ResultRecord)
        ) {
            params.unauthorizedResult = new ResultRecord(
                params.unauthorizedResult
            );
        }

        super(params);
    }

    // #endregion Constructor

    // ---------------------------------------------------------------------------------------------
    // #region Public Methods
    // ---------------------------------------------------------------------------------------------

    /**
     * Is the current user authenticated?
     */
    public isAuthenticated(): boolean {
        if (this.currentIdentity == null) {
            return false;
        }
        return this.currentIdentity.isValid();
    }

    /**
     * Initialize the global state record from values in local storage.
     * @returns GlobalStateRecord
     */
    public setFromLocalStorage(): GlobalStateRecord {
        return this.with({
            currentIdentity: LocalStorageUtils.get<IdentityRecord>(
                LocalStorageKey.Identity,
                IdentityRecord
            ),
        });
    }

    /**
     * Returns a new instance of the global state record
     * with the updated identity
     */
    public setIdentity(identity?: IdentityRecord): GlobalStateRecord {
        if (identity == null || !identity.isValid()) {
            return this.setUnauthenticated();
        }
        identity.refreshLocalStorage();

        return this.with({ currentIdentity: identity });
    }

    /**
     * Returns a new instance of the global state record
     * with the user unauthenticated
     */
    public setUnauthenticated(): GlobalStateRecord {
        localStorage.removeItem(LocalStorageKey.Identity);
        return this.with({ currentIdentity: undefined });
    }

    /**
     * Merges new values into the record and returns a new instance.
     *
     * @param {Partial<GlobalState>} values
     * @returns {GlobalStateRecord}
     * @memberof GlobalStateRecord
     */
    public with(values: Partial<GlobalState>): GlobalStateRecord {
        return new GlobalStateRecord(Object.assign(this.toJS(), values));
    }

    // #endregion Public Methods

    // ---------------------------------------------------------------------------------------------
    // #region Private Methods
    // ---------------------------------------------------------------------------------------------=

    // #endregion Private Methods
}
