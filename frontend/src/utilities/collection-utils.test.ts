import { CollectionUtils } from "utilities/collection-utils";

describe("CollectionUtils", () => {
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
});
