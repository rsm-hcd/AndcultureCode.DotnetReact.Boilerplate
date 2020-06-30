import { List } from "immutable";

/**
 * Loop through objects with a displaySequence property
 * and ensure there are no gaps, i.e. each item is consecutive,
 * and sorts the array by increasing displaySequence.
 * setDisplaySequence should be something like
 * (r: MyRecord, displaySequence: number) => r.with({ displaySequence })
 * @param array
 * @param setDisplaySequence
 * @param getDisplaySequence typically this isn't needed. it's here to support DisplaySequenceDraft.
 * @private
 */
const _collapseDisplaySequencesAndSort = <
    T extends { displaySequence: number }
>(
    array: Array<T>,
    setDisplaySequence: (t: T, displaySequence: number) => T,
    getDisplaySequence: (t: T) => number = (t: T) => t.displaySequence
): Array<T> => {
    const sorted = array.sort(
        (a: T, b: T) => getDisplaySequence(a) - getDisplaySequence(b)
    );

    return _collapseDisplaySequences(sorted, setDisplaySequence);
};

/**
 * Loop through objects with a displaySequence property
 * and ensure there are no gaps, i.e. each item is consecutive.
 * setDisplaySequence should be something like
 * (r: MyRecord, displaySequence: number) => r.with({ displaySequence })
 * @param array
 * @param setDisplaySequence
 */
const _collapseDisplaySequences = <T extends { displaySequence: number }>(
    array: Array<T>,
    setDisplaySequence: (t: T, displaySequence: number) => T
): Array<T> => {
    const newArray = [...array];
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = setDisplaySequence(newArray[i], i);
    }
    return newArray;
};

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
 * specified by selector, not considering the order of
 * elements, as long as all elements of one exist in the
 * other.
 * @param selector a function taking the item of the array and returning a property.
 * @param array1 first array to compare.
 * @param array2 second array to compare.
 * @returns true if both arrays contain all the same elements of the other,
 *          not considering order, false otherwise.
 */
const _equalsBy = <T, V>(
    selector: (element: T) => V,
    array1: Array<T> | List<any> | undefined,
    array2: Array<T> | List<any> | undefined
) => {
    if (array1 == null) {
        return array2 == null;
    }

    if (array2 == null) {
        return false;
    }

    if (_length(array1) !== _length(array2)) {
        return false;
    }

    const hasDifferingValues =
        array1.some(
            (s: T) => !array2.some((ss: T) => selector(s) === selector(ss))
        ) ||
        array2.some(
            (s: T) => !array1.some((ss: T) => selector(s) === selector(ss))
        );

    return !hasDifferingValues;
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

/**
 * Checks for values in a collection/object. Returns false if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.hasValues([]) or CollectionUtils.hasValues([], [], [])
 *
 * @param {(...Array<(any[] | List<any>)} collections
 * @returns {boolean} False if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. True if any element has sub-elements.
 */
const _hasValues = (
    ...collections: Array<any[] | List<any> | undefined>
): boolean => {
    if (collections == null) {
        return false;
    }

    let hasValues = false;
    collections.forEach((collection: any[] | List<any> | undefined) => {
        if (!_isEmpty(collection)) {
            hasValues = true;
        }
    });
    return hasValues;
};

/**
 * Checks for values in a collection/object. Returns true if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.isEmpty([]) or CollectionUtils.isEmpty([], [], [])
 *
 * @param {(...Array<(any[] | List<any>)} collections
 * @returns {boolean} True if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. False if any element has sub-elements.
 */
const _isEmpty = (
    ...collections: Array<any[] | List<any> | undefined>
): boolean => {
    if (collections == null) {
        return true;
    }

    let isEmpty = true;

    collections.forEach((collection: any[] | List<any> | undefined) => {
        if (collection == null) {
            return;
        }
        if (collection instanceof List) {
            const collectionList = collection as List<any>;
            if (collectionList.size !== 0) {
                isEmpty = false;
            }
        } else {
            const collectionArray = collection as any[];
            if (collectionArray.length !== 0) {
                isEmpty = false;
            }
        }
    });

    return isEmpty;
};

/**
 * Checks if there aren't any values in a collection/object. Returns false if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.isNotEmpty([]) or CollectionUtils.isNotEmpty([], [], [])
 *
 * @param {(...Array<(any[] | List<any>)} collections
 * @returns {boolean} False if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. True if any element has sub-elements.
 */
const _isNotEmpty = (
    ...collections: Array<any[] | List<any> | undefined>
): boolean => {
    return !_isEmpty(...collections);
};

/**
 * Returns a NEW array with the element at the specified index
 * replaced with the specified value. Since it returns a new array,
 * this can be safely used as the value for a React.SetStateAction
 * i.e. setMyArray(CollectionUtils.replaceElementAt(myArray, index, newValue));
 * @param source
 * @param index
 * @param value
 */
const _replaceElementAt = <T>(
    source: Array<T>,
    index: number,
    value: T
): Array<T> => {
    if (index < 0) {
        return [...source];
    }

    if (source.length === 0) {
        return source;
    }
    if (source.length === 1) {
        return [value];
    }

    if (index === source.length - 1) {
        return [...source.slice(0, index), value];
    }

    return [...source.slice(0, index), value, ...source.slice(index + 1)];
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
    collapseDisplaySequencesAndSort: _collapseDisplaySequencesAndSort,
    collapseDisplaySequences: _collapseDisplaySequences,
    equalsBy: _equalsBy,
    equalsByOrdered: _equalsByOrdered,
    handleDragAndDropReorder: _handleDragAndDropReorder,
    hasValues: _hasValues,
    isEmpty: _isEmpty,
    isNotEmpty: _isNotEmpty,
    length: _length,
    removeElementAt: _removeElementAt,
    replaceElementAt: _replaceElementAt,
    sortByString: _sortByString,
};
