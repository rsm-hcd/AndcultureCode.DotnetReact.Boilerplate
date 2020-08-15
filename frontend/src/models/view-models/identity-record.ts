import { Record } from "immutable";
import { Identity } from "models/interfaces/identity";
import UserRecord from "models/view-models/user-record";
import LocalStorageKey from "utilities/enumerations/local-storage-keys";
import { LocalStorageUtils } from "utilities/local-storage-utils";
import RoleRecord from "models/view-models/role-record";
import { RecordUtils } from "andculturecode-javascript-core";

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

        if (params.role != null) {
            params.role = RecordUtils.ensureRecord(params.role, RoleRecord);
        }

        if (params.user != null) {
            params.user = RecordUtils.ensureRecord(params.user, UserRecord);
        }

        super(params);
    }

    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region Public Methods
    // -----------------------------------------------------------------------------------------

    public hasRole(): boolean {
        return this.role != null;
    }

    public hasUser(): boolean {
        return this.user != null;
    }

    public hasUserId(): boolean {
        return this.hasUser() && this.userId() > 0;
    }

    public isValid(): boolean {
        return this.hasUserId();
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
        if (!this.hasUser() || this.user?.id == null) {
            return 0; // Not authenticated
        }

        return this.user.id;
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
