import { Record } from "immutable";
import { StringUtils, User } from "andculturecode-javascript-core";

const defaultValues: User = {
    email: undefined,
    firstName: "",
    id: undefined,
    isSuperAdmin: false,
    lastName: "",
    userName: undefined,
};

export default class UserRecord extends Record(defaultValues) implements User {
    /*
    ---------------------------------------------------------------------------------------------
    Properties
    ---------------------------------------------------------------------------------------------
    */

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    /*
    ---------------------------------------------------------------------------------------------
    Constructor
    ---------------------------------------------------------------------------------------------
    */

    constructor(params?: Partial<User>) {
        if (params == null) {
            params = Object.assign({}, defaultValues);
        }

        super(params);
    }

    // -----------------------------------------------------------------------------------------
    // #region Public Methods
    // -----------------------------------------------------------------------------------------

    public displayName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public hasFirstName(): boolean {
        return StringUtils.hasValue(this.firstName);
    }

    public hasLastName(): boolean {
        return StringUtils.hasValue(this.lastName);
    }

    public initials(): string {
        if (!this.hasFirstName() || !this.hasLastName()) {
            return "";
        }

        const firstInitial = this.firstName[0] ?? "";
        const lastInitial = this.lastName[0] ?? "";

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    public with(values: Partial<User>): UserRecord {
        return new UserRecord(Object.assign(this.toJS(), values));
    }

    // #endregion Public Methods
}
