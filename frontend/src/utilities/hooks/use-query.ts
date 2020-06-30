import { useEffect, useState } from "react";
import { ListServiceHook } from "utilities/services/service-hook-factory";
import { ToastManager } from "utilities/toast/toast-manager";

/**
 * Hook to automatically re-query the API when the query changes.
 * This hook is for ListServiceHook, but you could build the same
 * thing for NestedListServiceHook.
 * @param service a Service object which has a useList method
 * @param initialQuery the initial query to send to the API
 * @param onError optional; a method to call when the result has errors. Must be wrapped in useCallback
 */
export default function useQuery<TRecord, TQueryParams>(
    service: { useList: ListServiceHook<TRecord, TQueryParams> },
    initialQuery: TQueryParams,
    onError?: (e: any) => void
) {
    const { list } = service.useList();

    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(initialQuery);
    const [values, setValues] = useState<Array<TRecord>>([]);

    useEffect(() => {
        const runQuery = async () => {
            setLoading(true);

            try {
                const result = await list(query);
                setValues(result.resultObjects ?? []);
            } catch (e) {
                if (onError != null) {
                    onError(e);
                } else {
                    ToastManager.error("Failed to run query.");
                }
            }

            setLoading(false);
        };

        runQuery();
    }, [query, list, onError]);

    return {
        loading,
        query,
        setQuery,
        values,
        setValues,
    };
}
