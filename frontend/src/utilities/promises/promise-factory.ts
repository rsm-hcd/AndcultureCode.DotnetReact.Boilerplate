// ---------------------------------------------------------
// #region Public Methods
// ---------------------------------------------------------
const PromiseFactory = {
    /**
     * Creates a new and empty/unfullfilled promise to cancel further
     * chained promise operations
     */
    pending() {
        return new Promise(() => {});
    },
};

// #endregion Public Methods

// ---------------------------------------------------------
// Exports
// ---------------------------------------------------------

export default PromiseFactory;
