import { Auditable } from "andculturecode-javascript-core";
import RoleRecord from "models/view-models/role-record";

export default interface UserLogin extends Auditable {
    isSuccessful?: boolean;
    keepAliveOn?: string;
    password?: string;
    roleId?: number;
    userId?: number;
    userName?: string;
    userRoleId?: number;

    role?: RoleRecord;
}
