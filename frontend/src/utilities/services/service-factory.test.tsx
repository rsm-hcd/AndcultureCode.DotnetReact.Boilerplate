import UserRecord from "models/view-models/user-record";
import UserLoginRecord from "models/view-models/user-login-record";
import { CoreUtils } from "utilities/core-utils";
import ServiceFactory from "utilities/services/service-factory";
import mockAxios from "tests/mocks/mock-axios";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import { useEffect, useState } from "react";
import React from "react";
import { act, render } from "@testing-library/react";

// ---------------------------------------------------------------------------------------------
// #region Variables
// ---------------------------------------------------------------------------------------------

const baseEndpoint = "tests";
const cancellationTestsApiDelay = 10;
const cancellationTestsAssertionDelay = 20;
const resourceEndpoint = `${baseEndpoint}/:id`;
const nestedBaseEndpoint = `nested/:nestedId/${baseEndpoint}`;

// #endregion Variables

// ---------------------------------------------------------------------------------------------
// #region Stubs
// ---------------------------------------------------------------------------------------------

interface StubNestedParams {
    nestedId: number;
}

interface StubResourceParams {
    id: number;
}

// #endregion Stubs

// ---------------------------------------------------------------------------------------------
// #region Functions
// ---------------------------------------------------------------------------------------------

const itReturnsFunction = (func: Function, endpoint: string) => {
    it("returns function", () => {
        expect(func(UserLoginRecord, endpoint)).toBeInstanceOf(Function);
    });
};

// #endregion Functions

// ---------------------------------------------------------------------------------------------
// #region Tests
// ---------------------------------------------------------------------------------------------

describe("ServiceFactory", () => {
    // ---------------------------------------------------------------------------------------------
    // #region create
    // ---------------------------------------------------------------------------------------------

    describe("create", () => {
        itReturnsFunction(ServiceFactory.create, baseEndpoint);

        it("given null, throws error", async () => {
            expect.assertions(1);
            try {
                const sut = ServiceFactory.create(UserRecord, baseEndpoint);
                await sut(null as any); // <----- passing null
            } catch (e) {
                expect(e).toBeInstanceOf(TypeError);
            }
        });

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const create = ServiceFactory.create(UserRecord, baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord);

            mockAxios.postSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const CreateStubComponent = () => {
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function createUser() {
                        const result = await create(new UserRecord());
                        setUser(result.resultObject!);
                    }

                    createUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<CreateStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("given no record, when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord);

            const sut = ServiceFactory.create(UserRecord, baseEndpoint);
            mockAxios.postSuccess(expected);

            // Act
            const response = await sut(); // <---- null

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(UserRecord);
            expect(response.resultObject!.email).toEqual(expected.email);
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord);

            const sut = ServiceFactory.create(UserRecord, baseEndpoint);
            mockAxios.postSuccess(expected);

            // Act
            const response = await sut(expected);

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(UserRecord);
            expect(response.resultObject!.email).toEqual(expected.email);
        });
    });

    // #endregion create

    // ---------------------------------------------------------------------------------------------
    // #region delete
    // --------------------------------------------------------------------------------------------

    describe("delete", () => {
        itReturnsFunction(ServiceFactory.delete, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.delete(resourceEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            mockAxios.deleteSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const DeleteStubComponent = () => {
                const [deleted, setDeleted] = useState(false);

                useEffect(() => {
                    async function deleteUser() {
                        const result = await sut(record.id!);
                        setDeleted((result.resultObject || false) as boolean);
                    }

                    deleteUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{deleted && "deleted"}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<DeleteStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, given empty result, returns response without resultObject", async () => {
            // Arrange
            const sut = ServiceFactory.delete(resourceEndpoint);

            mockAxios.deleteSuccess(undefined);

            // Act
            const response = await sut(10);

            // Assert
            expect(response.resultObject).toBeUndefined();
        });
    });

    // #endregion delete

    // ---------------------------------------------------------------------------------------------
    // #region get
    // --------------------------------------------------------------------------------------------

    describe("get", () => {
        itReturnsFunction(ServiceFactory.get, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.get<UserRecord, StubResourceParams>(
                UserRecord,
                resourceEndpoint
            );
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            mockAxios.getSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const GetStubComponent = () => {
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function getUser() {
                        const result = await sut({ id: record.id! });
                        setUser(result.resultObject!);
                    }

                    getUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<GetStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            const sut = ServiceFactory.get<UserRecord, StubResourceParams>(
                UserRecord,
                resourceEndpoint
            );

            mockAxios.getSuccess(expected);

            // Act
            const response = await sut({ id: expected.id! });

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(UserRecord);
            expect(response.resultObject!.email).toEqual(expected.email);
        });
    });

    // #endregion get

    // ---------------------------------------------------------------------------------------------
    // #region list
    // ---------------------------------------------------------------------------------------------

    describe("list", () => {
        interface StubListParams {}

        itReturnsFunction(ServiceFactory.list, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.list<UserRecord, StubResourceParams>(
                UserRecord,
                baseEndpoint
            );
            const expectedResults = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            mockAxios.listSuccess(expectedResults, cancellationTestsApiDelay);

            let isUnmounted = false;

            const ListStubComponent = () => {
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function listUsers() {
                        const result = await sut();
                        setUsers(result.resultObjects!);
                    }

                    listUsers();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{users != null && users.map((u) => u.email!)}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<ListStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expectedResults = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            const sut = ServiceFactory.list<UserRecord, StubListParams>(
                UserRecord,
                baseEndpoint
            );
            mockAxios.listSuccess(expectedResults);

            // Act
            const response = await sut();

            // Assert
            const resultObjects = response.resultObjects;
            expect(resultObjects).not.toBeNull();
            expect(response.rowCount).toEqual(expectedResults.length);

            for (let i = 0; i < resultObjects!.length; i++) {
                const expected = expectedResults[i];
                const resultObject = resultObjects![i];
                expect(resultObject).toBeInstanceOf(UserRecord);
                expect(resultObject.email).toEqual(expected.email);
            }
        });
    });

    // #endregion list

    // ---------------------------------------------------------------------------------------------
    // #region nestedCreate
    // ---------------------------------------------------------------------------------------------

    describe("nestedCreate", () => {
        itReturnsFunction(ServiceFactory.nestedCreate, nestedBaseEndpoint);

        it("given null, throws error", async () => {
            expect.assertions(1);
            try {
                const sut = ServiceFactory.nestedCreate(
                    UserRecord,
                    baseEndpoint
                );

                await sut(null as any, {}); // <----- passing null
            } catch (e) {
                expect(e).toBeInstanceOf(TypeError);
            }
        });

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.nestedCreate<
                UserRecord,
                StubNestedParams
            >(UserRecord, nestedBaseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            mockAxios.postSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedCreateStubComponent = () => {
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function createUser() {
                        const result = await sut(record, { nestedId: 10 });
                        setUser(result.resultObject!);
                    }

                    createUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<NestedCreateStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord);

            const sut = ServiceFactory.nestedCreate<
                UserRecord,
                StubNestedParams
            >(UserRecord, nestedBaseEndpoint);

            mockAxios.postSuccess(expected);

            // Act
            const response = await sut(expected, { nestedId: 40 });

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(UserRecord);
            expect(response.resultObject!.email).toEqual(expected.email);
        });
    });

    // #endregion nestedCreate

    // ---------------------------------------------------------------------------------------------
    // #region nestedList
    // ---------------------------------------------------------------------------------------------

    describe("nestedList", () => {
        interface StubListQueryParams {}

        itReturnsFunction(ServiceFactory.nestedList, nestedBaseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.nestedList<
                UserRecord,
                StubNestedParams,
                StubListQueryParams
            >(UserRecord, nestedBaseEndpoint);
            const expectedResults = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            mockAxios.listSuccess(expectedResults, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedListStubComponent = () => {
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function listUsers() {
                        const result = await sut({ nestedId: 20 });
                        setUsers(result.resultObjects!);
                    }

                    listUsers();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{users != null && users.map((u) => u.email!)}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<NestedListStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expectedResults = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            const sut = ServiceFactory.nestedList<
                UserRecord,
                StubNestedParams,
                StubListQueryParams
            >(UserRecord, nestedBaseEndpoint);

            mockAxios.listSuccess(expectedResults);

            // Act
            const response = await sut({ nestedId: 40 });

            // Assert
            const resultObjects = response.resultObjects;
            expect(resultObjects).not.toBeNull();
            expect(response.rowCount).toEqual(expectedResults.length);

            for (let i = 0; i < resultObjects!.length; i++) {
                const expected = expectedResults[i];
                const resultObject = resultObjects![i];
                expect(resultObject).toBeInstanceOf(UserRecord);
                expect(resultObject.email).toEqual(expected.email);
            }
        });
    });

    // #endregion nestedList

    // ---------------------------------------------------------------------------------------------
    // #region update
    // ---------------------------------------------------------------------------------------------

    describe("update", () => {
        itReturnsFunction(ServiceFactory.update, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */

        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.update(UserRecord, resourceEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            mockAxios.putSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const UpdateStubComponent = () => {
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function updateUser() {
                        const result = await sut(record);
                        setUser(result.resultObject!);
                    }

                    updateUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            await act(async () => {
                const { unmount } = render(<UpdateStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            const sut = ServiceFactory.update(UserRecord, baseEndpoint);
            mockAxios.putSuccess(expected);

            // Act
            const response = await sut(expected);

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(UserRecord);
            expect(response.resultObject!.email).toEqual(expected.email);
        });
    });

    // #endregion update

    // -------------------------------------------------------------------------------------------------
    // #region BulkUpdate
    // -------------------------------------------------------------------------------------------------

    describe("bulkUpdate", () => {
        itReturnsFunction(ServiceFactory.bulkUpdate, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */

        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");
            const sut = ServiceFactory.bulkUpdate(UserRecord, resourceEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            mockAxios.putSuccess([record], cancellationTestsApiDelay);

            let isUnmounted = false;

            const BulkUpdateStubComponent = () => {
                const [users, setUsers] = useState<Array<UserRecord>>([]);

                useEffect(() => {
                    async function updateUsers() {
                        const result = await sut([record], { id: record.id! });
                        setUsers(result.resultObjects || []);
                    }

                    updateUsers();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return (
                    <div>
                        {users != null && users.length > 0 && users[0].email}
                    </div>
                );
            };

            // Act
            await act(async () => {
                const { unmount } = render(<BulkUpdateStubComponent />);
                unmount();
                // Force a sleep longer than when API promise resolves
                await CoreUtils.sleep(cancellationTestsAssertionDelay);
            });

            // Assert
            expect(isUnmounted).toBeTrue();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 20,
            });

            const sut = ServiceFactory.bulkUpdate(UserRecord, baseEndpoint);
            mockAxios.putSuccess([expected]);

            // Act
            const response = await sut([expected], { id: expected.id! });

            // Assert
            expect(response.resultObjects).not.toBeNull();
            expect(response.resultObjects).toBeInstanceOf(Array);
            expect(response.resultObjects![0].email).toEqual(expected.email);
        });
    });

    // #endregion BulkUpdate
});

// #endregion Tests
