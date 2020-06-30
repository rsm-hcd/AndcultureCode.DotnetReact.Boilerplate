import Entity from "models/interfaces/entity";

export default interface Auditable extends Entity {
    createdById?: number;
    createdOn?: string;
    deletedById?: number;
    deletedOn?: string;
    updatedById?: number;
    updatedOn?: string;
}
