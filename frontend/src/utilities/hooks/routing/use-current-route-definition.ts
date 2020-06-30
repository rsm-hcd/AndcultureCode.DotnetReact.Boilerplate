import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RouteUtils } from "utilities/route-utils";

/**
 * React hook to keep the {RouteDefinition} for the current route in state.
 */
export default function useCurrentRouteDefinition() {
    const location = useLocation();
    const [routeDefinition, setRouteDefinition] = useState(
        RouteUtils.getCurrentRouteDefinition()
    );

    useEffect(
        () => setRouteDefinition(RouteUtils.getCurrentRouteDefinition()),
        [location.pathname]
    );

    return routeDefinition;
}
