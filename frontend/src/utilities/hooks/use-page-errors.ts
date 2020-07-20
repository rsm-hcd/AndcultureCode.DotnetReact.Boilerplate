import { useState, useCallback } from "react";
import { ResultRecord } from "andculturecode-javascript-core";

/**
 * Hook to bundle common page error handling functionality
 */
export default function usePageErrors() {
    const [pageErrors, setPageErrors] = useState<Array<string>>([]);

    const handlePageLoadError = useCallback((result: any) => {
        if (result instanceof ResultRecord) {
            setPageErrors((e) => [...e, ...result.listErrorMessages()]);
            return;
        }

        setPageErrors((e) => [...e, result]);
    }, []);

    const resetPageErrors = useCallback(() => {
        setPageErrors([]);
    }, []);

    return {
        handlePageLoadError,
        pageErrors,
        resetPageErrors,
        setPageErrors,
    };
}
