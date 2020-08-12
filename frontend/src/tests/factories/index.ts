import globalStateRecordFactory from "tests/factories/global-state-record-factory";
import identityRecordFactory from "tests/factories/identity-record-factory";
import roleRecordFactory from "tests/factories/role-record-factory";
import userFactory from "tests/factories/user-factory";
import userLoginRecordFactory from "tests/factories/user-login-record-factory";

/**
 * Being factories are registered and referenced loosely, we must
 * export via an index so they get loaded via the build.
 */

export {
    globalStateRecordFactory,
    identityRecordFactory,
    roleRecordFactory,
    userFactory,
    userLoginRecordFactory,
};
