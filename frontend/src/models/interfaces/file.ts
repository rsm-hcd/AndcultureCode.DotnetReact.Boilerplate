import { Auditable } from "andculturecode-javascript-core";

export default interface File extends Auditable {
    relativeProviderPath: string;
    storageContainer?: string;
}
