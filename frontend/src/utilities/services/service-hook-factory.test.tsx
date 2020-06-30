import React, { useState, useEffect } from "react";
import { CoreUtils } from "utilities/core-utils";
import ServiceHookFactory from "utilities/services/service-hook-factory";
import UserRecord from "models/view-models/user-record";
import UserLoginRecord from "models/view-models/user-login-record";
import mockAxios from "tests/mocks/mock-axios";
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";
import { render, wait } from "@testing-library/react";
import { act } from "react-dom/test-utils";

// ---------------------------------------------------------------------------------------------
// #region Variables
// ---------------------------------------------------------------------------------------------

const baseEndpoint = "users";
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

describe("ServiceHookFactory", () => {
    const sut = ServiceHookFactory;

    // ---------------------------------------------------------------------------------------------
    // #region useCreate
    // ---------------------------------------------------------------------------------------------

    describe("useCreate", () => {
        itReturnsFunction(sut.useCreate, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useCreate = sut.useCreate<UserRecord>(
                UserRecord,
                baseEndpoint
            );
            const expectedUserRecord = Factory.build<UserRecord>(
                FactoryType.userRecord
            );
            mockAxios.postSuccess(expectedUserRecord);

            const CreateStubComponent = () => {
                const { create } = useCreate();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function createUser() {
                        const result = await create(new UserRecord());
                        setUser(result.resultObject!);
                    }

                    createUser();
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            const { getByText } = render(<CreateStubComponent />);

            // Assert
            await wait(() => {
                expect(
                    getByText(expectedUserRecord.email!)
                ).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useCreate = sut.useCreate<UserRecord>(
                UserRecord,
                baseEndpoint
            );

            const record = Factory.build<UserRecord>(FactoryType.userRecord);
            mockAxios.postSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const CreateStubComponent = () => {
                const { create } = useCreate();
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useCreate

    // ---------------------------------------------------------------------------------------------
    // #region useDelete
    // ---------------------------------------------------------------------------------------------

    describe("useDelete", () => {
        itReturnsFunction(sut.useDelete, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useDelete = sut.useDelete(resourceEndpoint);
            const userIdToDelete = 10;

            mockAxios.deleteSuccess(new Boolean(true));

            const DeleteStubComponent = () => {
                const { delete: deleteRecord } = useDelete();
                const [isDeleted, setIsDeleted] = useState<boolean>(false);

                useEffect(() => {
                    async function deleteUser() {
                        try {
                            const deleteResult = await deleteRecord(
                                userIdToDelete
                            );
                            setIsDeleted(
                                (deleteResult.resultObject || false) as boolean
                            );
                        } catch (e) {}
                    }
                    deleteUser();
                }, []);

                return <div>{isDeleted && "deleted"}</div>;
            };

            // Act
            const { getByText } = render(<DeleteStubComponent />);

            // Assert
            await wait(() => {
                expect(getByText("deleted")).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useDelete = sut.useDelete(baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 10,
            });
            mockAxios.deleteSuccess(record, cancellationTestsApiDelay);
            let isUnmounted = false;

            const DeleteStubComponent = () => {
                const { delete: deleteRecord } = useDelete();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function deleteUser() {
                        await deleteRecord(record.id!);
                        setUser(record);
                    }

                    deleteUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user!.id}</div>;
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useDelete

    // ---------------------------------------------------------------------------------------------
    // #region useGet
    // ---------------------------------------------------------------------------------------------

    describe("useGet", () => {
        itReturnsFunction(sut.useGet, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useGet = sut.useGet(UserRecord, resourceEndpoint);
            const expectedUserRecord = Factory.build<UserRecord>(
                FactoryType.userRecord,
                { id: 10 }
            );

            mockAxios.getSuccess(expectedUserRecord);

            const GetStubComponent = () => {
                const { get } = useGet();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function getUser() {
                        try {
                            const result = await get({
                                id: expectedUserRecord.id!,
                            });
                            setUser(result.resultObject!);
                        } catch (e) {}
                    }

                    getUser();
                }, []);

                return <div>{user != null && user.email}</div>;
            };

            // Act
            const { getByText } = render(<GetStubComponent />);

            // Assert
            await wait(() => {
                expect(
                    getByText(expectedUserRecord.email!)
                ).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useGet = sut.useGet(UserRecord, baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 10,
            });
            mockAxios.getSuccess(record, cancellationTestsApiDelay);
            let isUnmounted = false;

            const GetStubComponent = () => {
                const { get } = useGet();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function getUser() {
                        const result = await get(record.id!);
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useGet

    // ---------------------------------------------------------------------------------------------
    // #region useList
    // ---------------------------------------------------------------------------------------------

    describe("useList", () => {
        itReturnsFunction(sut.useList, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useList = sut.useList(UserRecord, baseEndpoint);
            const expectedUserRecords = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            mockAxios.listSuccess(expectedUserRecords);

            const ListStubComponent = () => {
                const { list } = useList();
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function listUsers() {
                        try {
                            const result = await list();
                            setUsers(result.resultObjects!);
                        } catch (e) {}
                    }
                    listUsers();
                }, []);

                return <div>{users != null && users.map((u) => u.email!)}</div>;
            };

            // Act
            const { getByText } = render(<ListStubComponent />);

            // Assert
            await wait(() => {
                expectedUserRecords.forEach((expected) => {
                    expect(
                        getByText(expected.email!, { exact: false })
                    ).toBeInTheDocument();
                });
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useList = sut.useList(UserRecord, baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 10,
            });
            mockAxios.getSuccess(record, cancellationTestsApiDelay);
            let isUnmounted = false;

            const ListStubComponent = () => {
                const { list } = useList();
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function listUsers() {
                        const result = await list();
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useList

    // ---------------------------------------------------------------------------------------------
    // #region useNestedCreate
    // ---------------------------------------------------------------------------------------------

    describe("useNestedCreate", () => {
        itReturnsFunction(sut.useNestedCreate, nestedBaseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useCreate = sut.useNestedCreate<UserRecord, StubNestedParams>(
                UserRecord,
                nestedBaseEndpoint
            );
            const expectedUserRecord = Factory.build<UserRecord>(
                FactoryType.userRecord
            );

            mockAxios.postSuccess(expectedUserRecord);

            const NestedCreateStubComponent = () => {
                const { create } = useCreate();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function createLogin() {
                        const result = await create(new UserRecord(), {
                            nestedId: 10,
                        });
                        setUser(result.resultObject!);
                    }
                    createLogin();
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            const { getByText } = render(<NestedCreateStubComponent />);

            // Assert
            await wait(() => {
                expect(
                    getByText(expectedUserRecord.email!)
                ).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useCreate = sut.useNestedCreate<UserRecord, StubNestedParams>(
                UserRecord,
                nestedBaseEndpoint
            );
            const record = Factory.build<UserRecord>(FactoryType.userRecord);

            mockAxios.postSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedCreateStubComponent = () => {
                const { create } = useCreate();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function createUser() {
                        const result = await create(new UserRecord(), {
                            nestedId: 10,
                        });
                        setUser(result.resultObject!);
                    }

                    createUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{user != null && user.email!}</div>;
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useNestedCreate

    // ---------------------------------------------------------------------------------------------
    // #region useNestedList
    // ---------------------------------------------------------------------------------------------

    describe("useNestedList", () => {
        itReturnsFunction(sut.useNestedList, nestedBaseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useList = sut.useNestedList<UserRecord, StubNestedParams, {}>(
                UserRecord,
                nestedBaseEndpoint
            );
            const expectedUserRecords = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            mockAxios.listSuccess(expectedUserRecords);

            const NestedListStubComponent = () => {
                const { list } = useList();
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function getUsers() {
                        const result = await list({
                            nestedId: 10,
                        });
                        setUsers(result.resultObjects!);
                    }
                    getUsers();
                }, []);

                return <div>{users != null && users.map((u) => u.email!)}</div>;
            };

            // Act
            const { getByText } = render(<NestedListStubComponent />);

            // Assert
            await wait(() => {
                expectedUserRecords.forEach((expected) => {
                    expect(
                        getByText(expected.email!, { exact: false })
                    ).toBeInTheDocument();
                });
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useList = sut.useNestedList<UserRecord, StubNestedParams, {}>(
                UserRecord,
                nestedBaseEndpoint
            );
            const records = Factory.buildList(
                FactoryType.userRecord,
                2
            ) as UserRecord[];

            mockAxios.getSuccess(records, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedListStubComponent = () => {
                const { list } = useList();
                const [users, setUsers] = useState<UserRecord[]>([]);

                useEffect(() => {
                    async function listUsers() {
                        const result = await list({ nestedId: 10 });
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useNestedList

    // ---------------------------------------------------------------------------------------------
    // #region useUpdate
    // ---------------------------------------------------------------------------------------------

    describe("useUpdate", () => {
        itReturnsFunction(sut.useUpdate, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useUpdate = sut.useUpdate(UserRecord, resourceEndpoint);
            const expectedUserRecord = Factory.build<UserRecord>(
                FactoryType.userRecord,
                { id: 10 }
            );

            mockAxios.putSuccess(expectedUserRecord);

            const UpdateStubComponent = () => {
                const { update } = useUpdate();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function updateUser() {
                        const result = await update(expectedUserRecord);
                        setUser(result.resultObject!);
                    }
                    updateUser();
                }, []);

                return <div>{user != null && user!.email}</div>;
            };

            // Act
            const { getByText } = render(<UpdateStubComponent />);

            // Assert
            await wait(() => {
                expect(
                    getByText(expectedUserRecord.email!)
                ).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useUpdate = sut.useUpdate(UserRecord, baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 10,
            });

            mockAxios.putSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const UpdateStubComponent = () => {
                const { update } = useUpdate();
                const [user, setUser] = useState<UserRecord>(null as any);

                useEffect(() => {
                    async function updateUser() {
                        const result = await update(record);
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useUpdate

    // ---------------------------------------------------------------------------------------------
    // #region useBulkUpdate
    // ---------------------------------------------------------------------------------------------

    describe("useBulkUpdate", () => {
        itReturnsFunction(sut.useBulkUpdate, baseEndpoint);

        it("when not-cancelled, resolves successfully", async () => {
            // Arrange
            const useBulkUpdate = sut.useBulkUpdate(
                UserRecord,
                resourceEndpoint
            );
            const expectedUserRecord = Factory.build<UserRecord>(
                FactoryType.userRecord,
                { id: 10 }
            );

            mockAxios.putSuccess([expectedUserRecord]);

            const UpdateStubComponent = () => {
                const { update } = useBulkUpdate();
                const [users, setUsers] = useState<Array<UserRecord>>(
                    null as any
                );

                useEffect(() => {
                    async function updateUser() {
                        const result = await update([expectedUserRecord], {
                            id: expectedUserRecord.id!,
                        });
                        setUsers(result.resultObjects!);
                    }
                    updateUser();
                }, []);

                return <div>{users != null && users[0].email}</div>;
            };

            // Act
            const { getByText } = render(<UpdateStubComponent />);

            // Assert
            await wait(() => {
                expect(
                    getByText(expectedUserRecord.email!)
                ).toBeInTheDocument();
            });
        });

        /**
         * Test ensures service hook factory in fact protects against a react error
         * when the component is unmounted before the promise resolves.
         *
         * See ServiceFactory.test.tsx for test that verifies react error thrown
         */
        it("when unmounted before resolution, promise is cancelled successfully", async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, "error");

            const useBulkUpdate = sut.useBulkUpdate(UserRecord, baseEndpoint);
            const record = Factory.build<UserRecord>(FactoryType.userRecord, {
                id: 10,
            });

            mockAxios.putSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const UpdateStubComponent = () => {
                const { update } = useBulkUpdate();
                const [users, setUsers] = useState<Array<UserRecord>>(
                    null as any
                );

                useEffect(() => {
                    async function updateUser() {
                        const result = await update([record], {
                            id: record.id!,
                        });
                        setUsers(result.resultObjects!);
                    }

                    updateUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{users != null && users[0].email}</div>;
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
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });

    // #endregion useBulkUpdate
});

// #endregion Tests
