import { Auditable } from "andculturecode-javascript-core";

export default interface Role extends Auditable {
    description?: string;
    name?: string;
}
