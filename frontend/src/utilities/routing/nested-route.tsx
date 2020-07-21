import { CoreUtils } from "andculturecode-javascript-core";
import React, { Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { RouteDefinition } from "utilities/interfaces/route-definition";
import AuthenticatedRoute from "utilities/routing/authenticated-route";
import { CollectionUtils } from "andculturecode-javascript-core";
import { siteMap } from "sitemap";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

export interface NestedRoutesProps {
    /**
     * If none of the the supplied routes are matched,
     * redirect to not-found (404) error page.
     * @default false
     */
    redirectIfNotFound?: boolean;
    routes: RouteDefinition[];
}

export interface NestedRoutesByPropertyProps {
    propertyName: keyof RouteDefinition;
    routes: RouteDefinition[];
}

/*
---------------------------------------------------------------------------------------------
Components
---------------------------------------------------------------------------------------------
*/

/**
 * Dynamically renders a route and its subroutes, accounting
 * for additional custom properties on RouteDefinition
 */
export const NestedRoute = (route: any) => {
    const RouteComponent: any = route.authRequired ? AuthenticatedRoute : Route;
    const childRoutes = CoreUtils.objectToArray(route.routes);

    return (
        <RouteComponent
            exact={route.exact}
            path={route.path}
            route={route}
            render={(props: any) => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={childRoutes} />
            )}
        />
    );
};

/**
 * Component to easily render nested sub-route components from a list of routes.
 * Commonly used when setting up a layout
 */
export const NestedRoutes = (props: NestedRoutesProps) => {
    if (CollectionUtils.isEmpty(props.routes)) {
        return null;
    }

    // TODO: Remove Fragment when issue fixed https://github.com/microsoft/TypeScript/issues/21699
    return (
        <Fragment>
            <Switch>
                {props.routes.map((route: any, i: any) => (
                    <NestedRoute key={i} {...route} />
                ))}
                {//if
                props.redirectIfNotFound === true && (
                    <Redirect to={siteMap.errors.notFound} />
                )}
            </Switch>
        </Fragment>
    );
};

/**
 * Renders Route components mapped to a custom property
 */
export const NestedRoutesByProperty = (props: NestedRoutesByPropertyProps) => {
    if (CollectionUtils.isEmpty(props.routes)) {
        return null;
    }

    // TODO: Remove Fragment when issue fixed https://github.com/microsoft/TypeScript/issues/21699
    return (
        <Fragment>
            {props.routes.map((route: any, i: any) => {
                const component = route[props.propertyName];

                if (component == null) {
                    return null;
                }

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        component={component}
                    />
                );
            })}
        </Fragment>
    );
};
