// -----------------------------------------------------------------------------------------
// #region Private Methods
// -----------------------------------------------------------------------------------------

/**
 * Request string value from local storage as generic
 * @param  {string} key
 * @param  {function} ctor Constructor to be used on record objects.
 * @returns T
 */
function _get<T>(key: string, ctor?: new (value: any) => T): T | undefined {
    const value = JSON.parse(localStorage.getItem(key) as string);
    if (ctor != null) {
        return new ctor(value);
    }

    return value as T;
}

/**
 * Request an Array of Records from Local Storage.
 * @param  {string} key
 * @param  {new(value:any} ctor
 * @returns T
 */
function _getArray<T>(
    key: string,
    ctor: new (value: any) => T
): T[] | undefined {
    const value = JSON.parse(localStorage.getItem(key) as string);
    const records: T[] = new Array<T>();
    if (Array.isArray(value)) {
        value.forEach((r) => {
            records.push(new ctor(r));
        });
    }
    return records;
}

/**
 * Cache key value pair to local storage as strings
 * @param  {string} key
 * @param  {T} value
 * @returns void
 */
function _set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a key value pair from Local storage
 * @param  {string} key
 * @returns void
 */
function _remove(key: string): void {
    localStorage.removeItem(key);
}

// #endregion Private Methods

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const LocalStorageUtils = {
    get: _get,
    getArray: _getArray,
    remove: _remove,
    set: _set,
};

// #endregion Exports
