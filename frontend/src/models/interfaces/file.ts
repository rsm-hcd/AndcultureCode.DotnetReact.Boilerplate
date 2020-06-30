import Auditable from "models/interfaces/auditable";

export default interface File extends Auditable {
    relativeProviderPath: string;
    storageContainer?: string;
}
