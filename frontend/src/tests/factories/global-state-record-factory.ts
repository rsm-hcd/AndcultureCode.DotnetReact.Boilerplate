import GlobalStateRecord from "models/view-models/global-state-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------

export const globalStateRecordFactory = Factory.define<GlobalStateRecord>(
    FactoryType.globalStateRecord,
    GlobalStateRecord
).sequence("currentIdentity", () => undefined);

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default globalStateRecordFactory;

// #endregion Export
