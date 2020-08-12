import RoleRecord from "models/view-models/role-record";
import UserRecord from "models/view-models/user-record";

export interface Identity {
    role?: RoleRecord;
    user?: UserRecord;
}
