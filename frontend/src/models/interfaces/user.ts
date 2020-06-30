import Auditable from "models/interfaces/auditable";

export default interface User extends Auditable {
    email?: string;
    externalIdentifier?: string;
    externalTopicsUpdatedOn?: string;
    firstName: string;
    isSuperAdmin?: boolean;
    lastName: string;
    userName?: string;
}
