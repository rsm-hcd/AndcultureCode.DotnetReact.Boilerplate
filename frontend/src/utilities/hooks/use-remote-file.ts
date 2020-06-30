import { useEffect, useState } from "react";
import RemoteAccessDetailsService from "utilities/services/remote-access-details-service";
import StringUtils from "utilities/string-utils";
import { ToastManager } from "utilities/toast/toast-manager";

export default function useRemoteFile(relativeProviderPath?: string) {
    const [absoluteUrl, setAbsoluteUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        get: getRemoteAccessDetailsApi,
    } = RemoteAccessDetailsService.useGet();

    useEffect(() => {
        const loadAbsoluteUrl = async () => {
            if (StringUtils.isEmpty(relativeProviderPath)) {
                return;
            }

            setLoading(true);

            try {
                const result = await getRemoteAccessDetailsApi(undefined, {
                    relativeProviderPath: relativeProviderPath!,
                });
                setAbsoluteUrl(result.resultObject?.url ?? "");
            } catch (e) {
                ToastManager.error("Failed to load remote file.");
            }

            setLoading(false);
        };

        loadAbsoluteUrl();
    }, [relativeProviderPath, getRemoteAccessDetailsApi]);

    return { absoluteUrl, loading };
}
