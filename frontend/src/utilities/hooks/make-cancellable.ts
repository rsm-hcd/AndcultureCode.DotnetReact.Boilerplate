import { PromiseFactory } from "andculturecode-javascript-core";

// ---------------------------------------------------------
// #region Public Methods
// ---------------------------------------------------------

/**
 * Wrap the provided promise in a promise that intercepts cancellation requests
 */
const makeCancellable = (promise: Promise<any>) => {
    let isCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) =>
        promise
            .then((value: any) =>
                isCanceled ? PromiseFactory.pending() : resolve(value)
            )
            .catch((error: any) =>
                isCanceled ? PromiseFactory.pending() : reject(error)
            )
    );

    return {
        promise: wrappedPromise,
        cancel() {
            isCanceled = true;
        },
    };
};

// #endregion Public Methods

// ---------------------------------------------------------
// Exports
// ---------------------------------------------------------

export default makeCancellable;
