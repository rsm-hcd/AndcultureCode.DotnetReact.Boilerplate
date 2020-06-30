import makeCancellable from "utilities/hooks/make-cancellable";
import { useRef, useEffect } from "react";

const useCancellablePromise = () => {
    // ---------------------------------------------------------
    // #region Member Variables
    // ---------------------------------------------------------

    /**
     * Array of current promises local to the component leveraging this hook.
     * Must use ref or it will get re-initialized upon each render.
     */
    const promises: any = useRef();

    // #endregion Member Variables

    // ---------------------------------------------------------
    // #region Event Hooks
    // ---------------------------------------------------------

    /**
     * Initializes the promises array and cleans up by calling cancel on every stored promise.
     */
    useEffect(() => {
        promises.current = promises.current || [];

        return function cancel() {
            promises.current.forEach((p: any) => p.cancel());
            promises.current = [];
        };
    }, []);

    // #endregion Event Hooks

    // ---------------------------------------------------------
    // #region Public Methods
    // ---------------------------------------------------------

    /**
     * Wraps the supplied promise and tracks its existance for cleanup later on
     */
    function cancellablePromise(promise: Promise<any>) {
        const wrappedPromise = makeCancellable(promise);
        promises.current.push(wrappedPromise);
        return wrappedPromise.promise;
    }

    // #endregion Public Methods

    return { cancellablePromise };
};

// ---------------------------------------------------------
// Exports
// ---------------------------------------------------------

export default useCancellablePromise;
