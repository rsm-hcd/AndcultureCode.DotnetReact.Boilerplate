import { List } from "immutable";
import { CollectionUtils } from "utilities/collection-utils";
import ResultRecord from "models/view-models/result-record";

describe("CollectionUtils", () => {
    describe("hasValues", () => {
        test("when collections param is an array and has elements, it returns true", (): void => {
            // Arrange
            const collection = [{}];

            // Act
            const result = CollectionUtils.hasValues(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is an array and has no elements, it returns false", (): void => {
            // Arrange
            const collection: any[] = [];

            // Act
            const result = CollectionUtils.hasValues(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is a list and has elements, it returns true", (): void => {
            // Arrange
            const collection = List([{}]);

            // Act
            const result = CollectionUtils.hasValues(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is a list and has no elements, it returns false", (): void => {
            // Arrange
            const collection = List([]);

            // Act
            const result = CollectionUtils.hasValues(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param has at least one non-empty collection, it returns true", (): void => {
            // Arrange
            const collection1 = [new ResultRecord()];
            const collection2 = List();

            // Act
            const result = CollectionUtils.hasValues(collection1, collection2);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param contains only empty collections, it returns false", (): void => {
            // Arrange
            const collection1: any[] = [];
            const collection2 = List();

            // Act
            const result = CollectionUtils.hasValues(collection1, collection2);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is undefined, it returns false", (): void => {
            // Arrange & Act
            const result = CollectionUtils.hasValues(
                (undefined as unknown) as any[]
            );

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is null, it returns false", (): void => {
            // Arrange & Act
            const result = CollectionUtils.hasValues(
                (null as unknown) as any[]
            );

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param contains undefined, null, and at least one collection with values, it returns true", (): void => {
            // Arrange
            const collection = [new ResultRecord()];
            const nullCollection = (null as unknown) as any[];
            const undefinedCollection = (undefined as unknown) as any[];

            // Act
            const result = CollectionUtils.hasValues(
                undefinedCollection,
                nullCollection,
                collection
            );

            // Assert
            expect(result).toBeTrue();
        });
    }); // end hasValues

    describe("isEmpty", () => {
        test(`when collections param is an array and has elements, it returns false`, (): void => {
            // Arrange
            const collection = [{}];

            // Act
            const result = CollectionUtils.isEmpty(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is an array and has no elements, it returns true", (): void => {
            // Arrange
            const collection: any[] = [];

            // Act
            const result = CollectionUtils.isEmpty(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is a list and has elements, it returns false", (): void => {
            // Arrange
            const collection = List([{}]);

            // Act
            const result = CollectionUtils.isEmpty(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is a list and has no elements, it returns true", (): void => {
            // Arrange
            const collection = List([]);

            // Act
            const result = CollectionUtils.isEmpty(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param has at least one non-empty collection, it returns false", (): void => {
            // Arrange
            const collection1 = [new ResultRecord()];
            const collection2 = List();

            // Act
            const result = CollectionUtils.isEmpty(collection1, collection2);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param has multiple empty collections, it returns true", (): void => {
            // Arrange
            const collection1: any[] = [];
            const collection2 = List();

            // Act
            const result = CollectionUtils.isEmpty(collection1, collection2);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is undefined, it returns true", (): void => {
            // Arrange & Act
            const result = CollectionUtils.isEmpty(
                (undefined as unknown) as any[]
            );

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is null, it returns true", (): void => {
            // Arrange & Act
            const result = CollectionUtils.isEmpty((null as unknown) as any[]);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param contains undefined, null, and at least one collection with values, it returns false", (): void => {
            // Arrange
            const collection = [new ResultRecord()];
            const nullCollection = (null as unknown) as any[];
            const undefinedCollection = (undefined as unknown) as any[];

            // Act
            const result = CollectionUtils.isEmpty(
                undefinedCollection,
                nullCollection,
                collection
            );

            // Assert
            expect(result).toBeFalse();
        });
    }); // end isEmpty()

    describe("#isNotEmpty", () => {
        test(`when collections param is an array and has elements, it returns true`, (): void => {
            // Arrange
            const collection = [{}];

            // Act
            const result = CollectionUtils.isNotEmpty(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is an array and has no elements, it returns false", (): void => {
            // Arrange
            const collection: any[] = [];

            // Act
            const result = CollectionUtils.isNotEmpty(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is a list and has elements, it returns true", (): void => {
            // Arrange
            const collection = List([{}]);

            // Act
            const result = CollectionUtils.isNotEmpty(collection);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param is a list and has no elements, it returns false", (): void => {
            // Arrange
            const collection = List([]);

            // Act
            const result = CollectionUtils.isNotEmpty(collection);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param has at least one non-empty collection, it returns true", (): void => {
            // Arrange
            const collection1 = [new ResultRecord()];
            const collection2 = List();

            // Act
            const result = CollectionUtils.isNotEmpty(collection1, collection2);

            // Assert
            expect(result).toBeTrue();
        });

        test("when collections param has multiple empty collections, it returns false", (): void => {
            // Arrange
            const collection1: any[] = [];
            const collection2 = List();

            // Act
            const result = CollectionUtils.isNotEmpty(collection1, collection2);

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is undefined, it returns false", (): void => {
            // Arrange & Act
            const result = CollectionUtils.isNotEmpty(
                (undefined as unknown) as any[]
            );

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param is null, it returns false", (): void => {
            // Arrange & Act
            const result = CollectionUtils.isNotEmpty(
                (null as unknown) as any[]
            );

            // Assert
            expect(result).toBeFalse();
        });

        test("when collections param contains undefined, null, and at least one collection with values, it returns true", (): void => {
            // Arrange
            const collection = [new ResultRecord()];
            const nullCollection = (null as unknown) as any[];
            const undefinedCollection = (undefined as unknown) as any[];

            // Act
            const result = CollectionUtils.isNotEmpty(
                undefinedCollection,
                nullCollection,
                collection
            );

            // Assert
            expect(result).toBeTrue();
        });
    }); // end isNotEmpty

    describe("#equalsBy", () => {
        type TestType = { id: number };
        const selector = (t: TestType) => t.id;

        it("When collections are different lengths, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [{ id: 1 }];

            // Act
            const result = CollectionUtils.equalsBy(selector, arr1, arr2);

            // Assert
            expect(result).toBe(false);
        });

        it("When one of the collections is null, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];

            // Act
            const result = CollectionUtils.equalsBy(selector, arr1, undefined);

            // Assert
            expect(result).toBe(false);
        });

        it("When both collections are null, then returns true", () => {
            // Act
            const result = CollectionUtils.equalsBy(
                selector,
                undefined,
                undefined
            );

            // Assert
            expect(result).toBe(true);
        });

        it("When collections are equal size but contain different elements, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [{ id: 2 }, { id: 3 }];

            // Act
            const result = CollectionUtils.equalsBy(selector, arr1, arr2);

            // Assert
            expect(result).toBe(false);
        });

        it("When collections are identical, then returns true", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [...arr1];

            // Act
            const result = CollectionUtils.equalsBy(selector, arr1, arr2);

            // Assert
            expect(result).toBe(true);
        });
    });

    describe("#equalsByOrdered", () => {
        type TestType = { id: number };
        const selector = (t: TestType) => t.id;

        it("When collections are different lengths, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [{ id: 1 }];

            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                arr1,
                arr2
            );

            // Assert
            expect(result).toBe(false);
        });

        it("When one of the collections is null, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];

            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                arr1,
                undefined
            );

            // Assert
            expect(result).toBe(false);
        });

        it("When both collections are null, then returns true", () => {
            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                undefined,
                undefined
            );

            // Assert
            expect(result).toBe(true);
        });

        it("When collections are equal size but contain different elements, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [{ id: 2 }, { id: 3 }];

            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                arr1,
                arr2
            );

            // Assert
            expect(result).toBe(false);
        });

        it("When collections are identical, then returns true", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [...arr1];

            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                arr1,
                arr2
            );

            // Assert
            expect(result).toBe(true);
        });

        it("When collections contain identical elements but are in a different order, then returns false", () => {
            // Arrange
            const arr1: Array<TestType> = [{ id: 1 }, { id: 2 }];
            const arr2: Array<TestType> = [arr1[1], arr1[0]];

            // Act
            const result = CollectionUtils.equalsByOrdered(
                selector,
                arr1,
                arr2
            );

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("#replaceElementAt", () => {
        it("When index is < 0, then returns exact copy of source array", () => {
            // Arrange
            const arr = ["zero", "one", "two"];
            const expected = [...arr];

            // Act
            const result = CollectionUtils.replaceElementAt(
                arr,
                -1,
                "replaced"
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("Replaces element at specified index and returns a new array", () => {
            // Arrange
            const arr = ["zero", "one", "two", "three", "four"];
            const expected = ["zero", "replaced", "two", "three", "four"];

            // Act
            const result = CollectionUtils.replaceElementAt(arr, 1, "replaced");

            // Assert
            const equals = CollectionUtils.equalsBy(
                (s: string) => s,
                result,
                expected
            );
            expect(equals).toBe(true);
        });
    });

    describe("#removeElementAt", () => {
        it("When index i < 0, returns source array", () => {
            // Arrange
            const arr = ["one", "two", "three"];
            const expected = [...arr];

            // Act
            const result = CollectionUtils.removeElementAt(arr, -1);

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When index > array.length, returns source array", () => {
            // Arrange
            const arr = ["one", "two", "three"];
            const expected = [...arr];

            // Act
            const result = CollectionUtils.removeElementAt(arr, 50);

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When index is in range, then removes element at index", () => {
            // Arrange
            const arr = ["one", "two", "three"];
            const expected = ["one", "three"];
            const indexToRemove = 1;

            // Act
            const result = CollectionUtils.removeElementAt(arr, indexToRemove);

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });

    describe("#sortByString", () => {
        type TestType = { letter: string };
        const selector = (t: TestType) => t.letter;

        it("Sorts an array by specified selector", () => {
            // Arrange
            const array = [
                { letter: "E" },
                { letter: "C" },
                { letter: "A" },
                { letter: "B" },
                { letter: "D" },
            ];
            const expected = [
                { letter: "A" },
                { letter: "B" },
                { letter: "C" },
                { letter: "D" },
                { letter: "E" },
            ];

            // Act
            const result = CollectionUtils.sortByString(array, selector);

            // Assert
            expect(result).toEqual(expected);
        });

        it("Ignores case sensitivity when sorting", () => {
            // Arrange
            const array = [
                { letter: "E" },
                { letter: "c" },
                { letter: "A" },
                { letter: "b" },
                { letter: "D" },
            ];
            const expected = [
                { letter: "A" },
                { letter: "b" },
                { letter: "c" },
                { letter: "D" },
                { letter: "E" },
            ];

            // Act
            const result = CollectionUtils.sortByString(array, selector);

            // Assert
            expect(result).toEqual(expected);
        });

        it("Puts empty string values at the end", () => {
            // Arrange
            const array = [
                { letter: "" },
                { letter: "B" },
                { letter: "A" },
                { letter: "C" },
            ];
            const expected = [
                { letter: "A" },
                { letter: "B" },
                { letter: "C" },
                { letter: "" },
            ];

            // Act
            const result = CollectionUtils.sortByString(array, selector);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe("#collapseDisplaySequencesAndSort", () => {
        interface DisplaySeqObj {
            id: number;
            displaySequence: number;
        }

        const mapperFn = (obj: DisplaySeqObj, displaySequence: number) => {
            obj.displaySequence = displaySequence;
            return obj;
        };

        it("When there are gaps in displaySequence values, then they are collapsed", () => {
            // Arrange
            const input: Array<DisplaySeqObj> = [
                {
                    id: 1,
                    displaySequence: 1,
                },
                {
                    id: 2,
                    displaySequence: 2,
                },
                {
                    id: 3,
                    displaySequence: 4,
                },
                {
                    id: 4,
                    displaySequence: 10,
                },
            ];
            const expected: Array<DisplaySeqObj> = [
                {
                    id: 1,
                    displaySequence: 0,
                },
                {
                    id: 2,
                    displaySequence: 1,
                },
                {
                    id: 3,
                    displaySequence: 2,
                },
                {
                    id: 4,
                    displaySequence: 3,
                },
            ];

            // Act
            const result = CollectionUtils.collapseDisplaySequencesAndSort(
                input,
                mapperFn
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When array is not sorted, then returns sorted array", () => {
            // Arrange
            const input: Array<DisplaySeqObj> = [
                {
                    id: 1,
                    displaySequence: 3,
                },
                {
                    id: 2,
                    displaySequence: 0,
                },
                {
                    id: 3,
                    displaySequence: 2,
                },
                {
                    id: 4,
                    displaySequence: 1,
                },
            ];
            const expected: Array<DisplaySeqObj> = [
                {
                    id: 2,
                    displaySequence: 0,
                },
                {
                    id: 4,
                    displaySequence: 1,
                },
                {
                    id: 3,
                    displaySequence: 2,
                },
                {
                    id: 1,
                    displaySequence: 3,
                },
            ];

            // Act
            const result = CollectionUtils.collapseDisplaySequencesAndSort(
                input,
                mapperFn
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When array is not sorted and there are gaps, then returns sorted array with no gaps", () => {
            // Arrange
            const input: Array<DisplaySeqObj> = [
                {
                    id: 1,
                    displaySequence: 50,
                },
                {
                    id: 2,
                    displaySequence: 666,
                },
                {
                    id: 3,
                    displaySequence: 420,
                },
                {
                    id: 4,
                    displaySequence: 999,
                },
            ];
            const expected: Array<DisplaySeqObj> = [
                {
                    id: 1,
                    displaySequence: 0,
                },
                {
                    id: 3,
                    displaySequence: 1,
                },
                {
                    id: 2,
                    displaySequence: 2,
                },
                {
                    id: 4,
                    displaySequence: 3,
                },
            ];

            // Act
            const result = CollectionUtils.collapseDisplaySequencesAndSort(
                input,
                mapperFn
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });

    describe("#handleDragAndDropReorder", () => {
        it("When startIndex === endIndex, then returns unchanged array", () => {
            // Arrange
            const input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            const expected = [...input];

            // Act
            const result = CollectionUtils.handleDragAndDropReorder(
                input,
                1,
                1
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When startIndex is less than endIndex, then item is properly spliced into correct index", () => {
            // Arrange
            const input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            const expected = [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }];

            // Act
            const result = CollectionUtils.handleDragAndDropReorder(
                input,
                1,
                2
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });

        it("When startIndex is greater than endIndex, then item is properly spliced into correct index", () => {
            // Arrange
            const input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            const expected = [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }];

            // Act
            const result = CollectionUtils.handleDragAndDropReorder(
                input,
                2,
                1
            );

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });
});
