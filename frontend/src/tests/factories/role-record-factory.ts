import RoleRecord from "models/view-models/role-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------

export const roleRecordFactory = Factory.define<RoleRecord>(
    FactoryType.roleRecord,
    RoleRecord
)
    .sequence("description", (i: number) => `role${i}`)
    .sequence("name", (i: number) => `role${i}`);

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default roleRecordFactory;

// #endregion Export
