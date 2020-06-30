import { CollectionUtils } from "utilities/collection-utils";

// -----------------------------------------------------------------------------------------
// #region Private Methods
// -----------------------------------------------------------------------------------------

const _objectToArray = (object: any): any[] => {
    const result: any[] = [];

    if (CollectionUtils.isEmpty(object)) {
        return result;
    }

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result.push(object[key]);
        }
    }

    return result;
};

/**
 * Wrap timeout in a promise so tests can easily block execution for testing time
 * @param milliseconds
 */
const sleep = (milliseconds: number, debug: boolean = false) => {
    if (debug) {
        console.log("sleep start");
    }

    return new Promise((resolve) =>
        setTimeout(() => {
            if (debug) {
                console.log("sleep end");
            }

            resolve();
        }, milliseconds)
    );
};

/**
 * Creates a timer instance that when stopped will supply elapsed time in milliseconds.
 * Useful for benchmarking or providing counters
 * @param name Useful name to identify the timer
 */
const timer = (name: string) => {
    var start = new Date();
    return {
        /**
         * Stops the timer and returns elapsed time in milliseconds
         * @param log Optional flag if you'd like the timer to log to the console
         */
        stop(log?: boolean): number {
            var end = new Date();
            var time = end.getTime() - start.getTime();

            if (log === true) {
                console.log("Timer:", name, "finished in", time, "ms");
            }

            return time;
        },
    };
};

// #endregion Private Methods

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const CoreUtils = {
    objectToArray: _objectToArray,
    sleep,
    timer,
};

// #endregion Exports
