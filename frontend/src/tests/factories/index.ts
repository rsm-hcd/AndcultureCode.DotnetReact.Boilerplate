import fileRecordFactory from "tests/factories/file-record-factory";
import globalStateRecordFactory from "tests/factories/global-state-record-factory";
import identityRecordFactory from "tests/factories/identity-record-factory";
import userFactory from "tests/factories/user-factory";

/**
 * Being factories are registered and referenced loosely, we must
 * export via an index so they get loaded via the build.
 */

export {
    fileRecordFactory,
    globalStateRecordFactory,
    identityRecordFactory,
    userFactory,
};
