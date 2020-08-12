import { Record } from "immutable";
import UserLogin from "models/interfaces/user-login";
import RoleRecord from "models/view-models/role-record";
import { RecordUtils } from "andculturecode-javascript-core";

const defaultValues: UserLogin = {
    createdById: undefined,
    createdOn: undefined,
    deletedById: undefined,
    deletedOn: undefined,
    id: undefined,
    isSuccessful: undefined,
    keepAliveOn: undefined,
    password: undefined,
    role: undefined,
    roleId: undefined,
    updatedById: undefined,
    updatedOn: undefined,
    userId: undefined,
    userName: undefined,
};

export default class UserLoginRecord extends Record(defaultValues)
    implements UserLogin {
    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // -----------------------------------------------------------------------------------------
    // #region Constructor
    // -----------------------------------------------------------------------------------------

    constructor(params?: UserLogin) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        if (params.role != null) {
            params.role = RecordUtils.ensureRecord(params.role, RoleRecord);
        }

        super(params);
    }

    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region Public Methods
    // -----------------------------------------------------------------------------------------

    /**
     * Returns whether or not the current UserLoginRecord has an associated RoleRecord
     * Note: This can be at the top-level (this.role) or nested (this.userRole.role)
     *
     * @returns {boolean}
     * @memberof UserLoginRecord
     */
    public hasRole(): boolean {
        return this.role != null;
    }

    /**
     * Merges new values into the record and returns a new instance.
     *
     * @param {Partial<UserLogin>} values
     * @returns {UserLoginRecord}
     * @memberof UserLoginRecord
     */
    public with(values: Partial<UserLogin>): UserLoginRecord {
        return new UserLoginRecord(Object.assign(this.toJS(), values));
    }

    /**
     * Adds RoleRecord relationship to UserLoginRecord from a list of RoleRecords.
     *
     * @param {RoleRecord[]} [roles]
     * @returns {UserLoginRecord}
     * @memberof UserLoginRecord
     */
    public withRole(roles?: RoleRecord[]): UserLoginRecord {
        if (roles == null) {
            return this.with({});
        }

        return this.with({
            role: roles.find((role: RoleRecord) => role.id === this.roleId),
        });
    }

    // #endregion Public Methods
}
