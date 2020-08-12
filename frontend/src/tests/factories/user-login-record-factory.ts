import UserLoginRecord from "models/view-models/user-login-record";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------

export const userLoginRecordFactory = Factory.define<UserLoginRecord>(
    FactoryType.userLoginRecord,
    UserLoginRecord
).sequence("userId", (i: number) => i);

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default userLoginRecordFactory;

// #endregion Export
