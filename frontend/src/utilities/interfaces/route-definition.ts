import { RouteMap } from "utilities/interfaces/route-map";
import React from "react";

export interface RouteDefinition {
    authRequired: boolean;
    component: React.ComponentType;
    exact?: boolean;
    getComponent?: (location: any, cb: any) => void;
    path: string;
    routes: RouteMap;
    sidebar?: React.ComponentType;
}
