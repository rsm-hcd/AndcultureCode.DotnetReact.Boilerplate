import { Record } from "immutable";
import { Role } from "andculturecode-javascript-core";
import { StringUtils } from "andculturecode-javascript-core";

const defaultValues: Role = {
    createdById: undefined,
    createdOn: undefined,
    deletedById: undefined,
    deletedOn: undefined,
    description: undefined,
    id: 0,
    name: undefined,
    updatedById: undefined,
    updatedOn: undefined,
};

export default class RoleRecord extends Record(defaultValues) implements Role {
    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    // -----------------------------------------------------------------------------------------
    // #region Constructor
    // -----------------------------------------------------------------------------------------

    constructor(params?: Role) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        super(params);
    }
    // #endregion Constructor

    // -----------------------------------------------------------------------------------------
    // #region Public Methods
    // -----------------------------------------------------------------------------------------

    /**
     * Returns the role name if it has a value.
     *
     * @default ""
     * @returns {string}
     * @memberof RoleRecord
     */
    public getName(): string {
        if (!this.hasName()) {
            return "";
        }

        return this.name!;
    }

    /**
     * Returns whether or not this RoleRecord has a non-null, non-whitespace name
     *
     * @returns {boolean}
     * @memberof RoleRecord
     */
    public hasName(): boolean {
        return StringUtils.hasValue(this.name);
    }

    /**
     * Merges new values into the record and returns a new instance.
     *
     * @param {Partial<Role>} values
     * @returns {RoleRecord}
     * @memberof RoleRecord
     */
    public with(values: Partial<Role>): RoleRecord {
        return new RoleRecord(Object.assign(this.toJS(), values));
    }

    // #endregion Public Methods
}
