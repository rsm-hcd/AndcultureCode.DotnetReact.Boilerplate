import IdentityRecord from "models/view-models/identity-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------
export const identityRecordFactory = Factory.define<IdentityRecord>(
    FactoryType.identityRecord,
    IdentityRecord
).sequence("user", () => undefined);

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------
export default identityRecordFactory;
// #endregion Export
