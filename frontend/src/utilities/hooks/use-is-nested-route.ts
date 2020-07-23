import { useEffect, useState } from "react";
import useCurrentRouteDefinition from "utilities/hooks/use-current-route-definition";

/**
 * React hook returning a boolean indicating
 * whether the current route is nested under the specified route.
 */
export default function useIsNestedRoute(parentRoutePath: string) {
    const currentRoute = useCurrentRouteDefinition();
    const [isNestedRoute, setIsNestedRoute] = useState(
        currentRoute?.path?.startsWith(parentRoutePath)
    );

    useEffect(
        () => setIsNestedRoute(currentRoute?.path?.startsWith(parentRoutePath)),
        [currentRoute, parentRoutePath]
    );

    return isNestedRoute;
}
