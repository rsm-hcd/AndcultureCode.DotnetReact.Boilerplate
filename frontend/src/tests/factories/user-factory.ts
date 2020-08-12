import { Factory } from "rosie";
import { User } from "andculturecode-javascript-core";
import FactoryType from "tests/factories/factory-type";
import UserRecord from "models/view-models/user-record";

// NOTE: When creating a new factory, be sure to add it to index.ts

export const userFactory = Factory.define<User>(FactoryType.user)
    .sequence("email", (i) => `testemail${i}@email.com`)
    .sequence("firstName", (i) => `First${i}`)
    .sequence("lastName", (i) => `Last${i}`)
    .sequence("userName", (i) => `testuser${i}`);

export const userRecordFactory = Factory.define<UserRecord>(
    FactoryType.userRecord,
    UserRecord
)
    .sequence("email", (i) => `testemail${i}@email.com`)
    .sequence("firstName", (i) => `First${i}`)
    .sequence("lastName", (i) => `Last${i}`)
    .sequence("userName", (i) => `testuser${i}`);

export default userFactory;
