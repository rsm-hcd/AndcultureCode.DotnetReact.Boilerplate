import { Record } from "immutable";
import { Identity } from "models/interfaces/identity";
import UserRecord from "models/view-models/user-record";
import LocalStorageKey from "utilities/enumerations/local-storage-keys";
import { LocalStorageUtils } from "utilities/local-storage-utils";
import RoleRecord from "models/view-models/role-record";

const defaultValues: Identity = {
    role: undefined,
    user: undefined,
};

export default class IdentityRecord extends Record(defaultValues)
    implements Identity {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // #endregion Properties

    // -----------------------------------------------------------------------------------------
    // #region Constructor
    // -----------------------------------------------------------------------------------------

    constructor(params?: Identity) {
        if (params == null) {
            params = { ...defaultValues };
        }

        if (params.role != null && !(params.role instanceof RoleRecord)) {
            params.role = new RoleRecord(params.role);
        }

        if (params.user != null && !(params.user instanceof UserRecord)) {
            params.user = new UserRecord(params.user);
        }

        super(params);
    }

    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region Public Methods
    // -----------------------------------------------------------------------------------------

    public isValid(): boolean {
        return true;
    }

    /**
     * Utility method to update the identity properties in local storage
     * @returns void
     */
    public refreshLocalStorage(): void {
        LocalStorageUtils.set<IdentityRecord>(LocalStorageKey.Identity, this);
    }

    /**
     * Utility to return the current user id
     * @returns number
     */
    public userId(): number {
        if (this.user != null && this.user.id != null) {
            return this.user.id;
        }
        // Not authenticated
        return 0;
    }

    /**
     * Returns new object based on `this` and merges the partial values
     * @param  {Partial<Identity>} values
     * @returns Identity
     */
    public with(values: Partial<Identity>): IdentityRecord {
        return new IdentityRecord(Object.assign(this.toJS(), values));
    }

    // #endregion Public Methods
}
