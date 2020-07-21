import { List } from "immutable";

/**
 * Utility function to get the length of a collection
 * when the collection might be either a List or an Array
 * @param arr the collection
 * @returns number the length of the collection
 */
const _length = (arr: Array<any> | List<any>): number => {
    if (arr == null) {
        return -1;
    }

    if (arr instanceof List) {
        return (arr as List<any>).size;
    }

    return (arr as Array<any>).length;
};

/**
 * Utility method to get an element out of something that could be either an array or a list.
 * @param arr
 * @param index
 * @private
 */
const _get = <T>(arr: Array<T> | List<T>, index: number): T | undefined => {
    if (arr instanceof List) {
        return (arr as List<T>).get(index);
    }

    return (arr as Array<T>)[index];
};

/**
 * Compare two collections by a property of each value,
 * specified by selector, including considering the order of
 * elements, as long as all elements of one exist in the
 * other.
 * @param selector a function taking the item of the array and returning a property.
 * @param array1 first array to compare.
 * @param array2 second array to compare.
 * @returns true if both arrays contain all the same elements of the other,
 *          not considering order, false otherwise.
 */
const _equalsByOrdered = <T, V>(
    selector: (element: T) => V,
    array1: Array<T> | List<any> | undefined,
    array2: Array<T> | List<any> | undefined
): boolean => {
    if (array1 == null) {
        return array2 == null;
    }

    if (array2 == null) {
        return false;
    }

    if (_length(array1) !== _length(array2)) {
        return false;
    }

    for (let i = 0; i < _length(array1); i++) {
        if (_get(array1, i) !== _get(array2, i)) {
            return false;
        }
    }

    return true;
};

const _handleDragAndDropReorder = <T extends any>(
    items: Array<T>,
    startIndex: number,
    endIndex: number
): Array<T> => {
    const result = [...items];
    const [removedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removedItem);

    return result;
};

const _removeElementAt = <T>(source: Array<T>, index: number): Array<T> => {
    if (index < 0 || index > source.length) {
        return source;
    }

    const newArr = [...source];
    newArr.splice(index, 1);
    return newArr;
};

/**
 * Sorts an array alphabetically by provided selector.
 * Use: CollectionUtils.sortByString(array, selector)
 * @param array
 * @param selector
 */
const _sortByString = <T extends any>(
    array: Array<T>,
    selector: (element: T) => string
) => {
    return array.sort((a: T, b: T) => {
        const aString = selector(a).toLowerCase();
        const bString = selector(b).toLowerCase();

        if (aString === "" || aString === null) {
            return 1;
        }

        if (bString === "" || bString === null) {
            return -1;
        }

        if (aString === bString) {
            return 0;
        }

        if (aString < bString) {
            return -1;
        }

        return 1;
    });
};

export const CollectionUtils = {
    equalsByOrdered: _equalsByOrdered,
    handleDragAndDropReorder: _handleDragAndDropReorder,
    removeElementAt: _removeElementAt,
    sortByString: _sortByString,
};
