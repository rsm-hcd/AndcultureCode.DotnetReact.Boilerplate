import { LocalStorageUtils } from "utilities/local-storage-utils";
import { ResultRecord } from "andculturecode-javascript-core";

describe("LocalStorageUtils", () => {
    const testKey = "testKey";
    let record = new ResultRecord<any>();

    beforeEach(() => {
        localStorage.clear();

        record = new ResultRecord({
            resultObject: { prop: "value" },
        });
    });

    // -----------------------------------------------------------------------------------------
    // #region get
    // -----------------------------------------------------------------------------------------

    describe("get", () => {
        test("should return ResultRecord", () => {
            // Arrange
            LocalStorageUtils.set<ResultRecord<any>>(testKey, record);

            // Act
            const result = LocalStorageUtils.get<ResultRecord<any>>(
                testKey,
                ResultRecord
            );
            // Assert
            expect(result).not.toBeUndefined();
            expect(result).toBeInstanceOf(ResultRecord);
        });

        test("should return array of integers", () => {
            // Arrange
            LocalStorageUtils.set<number[]>("numbers", [1, 2, 3, 4]);

            // Act
            const result = LocalStorageUtils.get<number[]>("numbers");

            // Assert
            expect(result).toBeInstanceOf(Array);
            expect(typeof result![0]).toBe("number");
            expect(result!.length).toBe(4);
        });
    });

    // #endregion get

    // -----------------------------------------------------------------------------------------
    // #region getArray
    // -----------------------------------------------------------------------------------------

    describe("getArray", () => {
        test("should return Array of Records", () => {
            // Arrange
            let results: ResultRecord<any>[] = new Array<ResultRecord<any>>();

            for (let i = 0; i < 5; i++) {
                results.push(new ResultRecord({ resultObject: i }));
            }

            LocalStorageUtils.set<ResultRecord<any>[]>(testKey, results);

            // Act
            const result = LocalStorageUtils.getArray<ResultRecord<any>>(
                testKey,
                ResultRecord
            );

            // Assert
            expect(result).not.toBeUndefined();
            expect(result).toBeInstanceOf(Array);
            expect(result![0]).toBeInstanceOf(ResultRecord);
            expect(result!.length).toBe(5);
        });
    });

    // #endregion getArray

    // -----------------------------------------------------------------------------------------
    // #region set
    // -----------------------------------------------------------------------------------------

    describe("set", () => {
        test("should set object to local storage", () => {
            // Act
            LocalStorageUtils.set<ResultRecord<any>>(testKey, record);
            const result = localStorage.getItem(testKey);

            // Assert
            expect(result).not.toBeNull();
        });
    });

    // #endregion set

    // -----------------------------------------------------------------------------------------
    // #region remove
    // -----------------------------------------------------------------------------------------

    describe("remove", () => {
        test("should remove object", () => {
            // Arrange
            LocalStorageUtils.set<ResultRecord<any>>(testKey, record);

            // Act
            LocalStorageUtils.remove(testKey);

            // Assert
            expect(localStorage.length).toBe(0);
        });
    });

    // #endregion remove
});
