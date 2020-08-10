import { routes } from "routes";
import { siteMap } from "sitemap";
import {
    CollectionUtils,
    CoreUtils,
    RouteUtils as AndcultureCodeRouteUtils,
    StringUtils,
} from "andculturecode-javascript-core";
import {
    RouteDefinition,
    RouteUtils as AndcultureCodeReactRouteUtils,
} from "andculturecode-javascript-react";

/*
---------------------------------------------------------------------------------------------
Constants
---------------------------------------------------------------------------------------------
*/

const _routeParamRegEx = /(:[a-z_-]*)/gi;
let _cachedFlattenedRoutes: Array<RouteDefinition> | undefined = undefined;

/*
---------------------------------------------------------------------------------------------
Functions
---------------------------------------------------------------------------------------------
*/

/**
 * regex removes everything preceding the first since / (i.e. the location)
 * so https://google.com/some/url/path becomes some/url/path
 * @param absolutePath
 */
const absoluteToRelativePath = (absolutePath: string): string =>
    absolutePath.replace(/^(?:\/\/|[^/]+)*\//, "");

/**
 * Get the {RouteDefinition} metadata for the specified route; defaults to the current route of the application.
 * @param route the route for which to retrieve the {RouteDefinition} metadata; defaults to current route of the
 * application.
 */
const getCurrentRouteDefinition = (
    route?: string
): RouteDefinition | undefined => {
    let currentRoute = route ?? window.location.pathname;
    if (currentRoute === "/" || StringUtils.isEmpty(currentRoute)) {
        return routes.home;
    }

    if (currentRoute.endsWith("/")) {
        currentRoute = currentRoute.substr(0, currentRoute.length - 1);
    }

    if (StringUtils.isEmpty(currentRoute)) {
        return undefined;
    }

    if (CollectionUtils.isEmpty(_cachedFlattenedRoutes)) {
        _cachedFlattenedRoutes = AndcultureCodeReactRouteUtils.getFlattenedRoutes(
            CoreUtils.objectToArray(routes)
        );
    }

    // we already matched the home route above, so filter it out
    // and sort by length of path so that nested routes appear after their parents
    const allRoutes: Array<RouteDefinition> = _cachedFlattenedRoutes!
        .filter((r: RouteDefinition) => r.path !== siteMap.root)
        .sort(
            (a: RouteDefinition, b: RouteDefinition) =>
                a.path.length - b.path.length
        );

    let matchedRoute: RouteDefinition | undefined = undefined;
    for (const r of allRoutes) {
        let path = r.path;
        // regex replace params with regex to match any param value
        // and replace / with escaped version, \/
        path = path
            .replace(/:[a-zA-Z-]*/gi, ".*")
            .split("/")
            .join("\\/");

        if (path.includes(".*")) {
            // if route params exist in the route, regex match
            if (new RegExp(path, "gi").test(currentRoute)) {
                matchedRoute = r;
            }
            continue;
        }

        if (r.path === currentRoute) {
            // else, do an exact match
            matchedRoute = r;
        }
    }

    return matchedRoute;
};

/**
 * Assert that the current URL matches the Route given. Ignores query string.
 * @param route             the Route to compile
 * @param routeParams       any parameters needed to build the Route
 * @param pageUrl           optionally pass the current URL as a param so that we can use location.pathname from
 *                          useLocation()
 */
const assertCurrentUrl = (
    route: string,
    routeParams?: any,
    pageUrl?: string
): boolean => {
    const givenUrl = getUrl(route, routeParams);
    let currentUrl = pageUrl ?? window.location.pathname;

    // cut off the query string, if there is one
    currentUrl = removeQueryString(currentUrl);

    return givenUrl === currentUrl;
};

/**
 * Constructs a url from a formatted route path.
 * @param path Route path template. Parameters in the path are denoted withed a colon `:id`
 * @param pathParams Object with keys matching supplied path template components
 * @param queryParams Object to get translated to the query string of the url
 * @param hashLink String value of an element's id attribute to anchor to
 */
const getUrl = (
    path: string,
    pathParams?: any,
    queryParams?: any,
    hashLink?: string
) => {
    if (path == null) {
        return path;
    }

    if (pathParams != null) {
        path = replacePathParams(path, pathParams);
    }

    if (queryParams != null) {
        path = AndcultureCodeRouteUtils.appendQueryParams(path, queryParams);
    }

    if (StringUtils.hasValue(hashLink)) {
        path += hashLink;
    }

    return path;
};

const removeQueryString = (url: string): string => {
    const index = url.indexOf("?");
    if (index > -1) {
        return url.substr(0, index);
    }

    return url;
};

/**
 * Replace routing components in supplied path with keys and values
 * of supplied pathParams.
 * @param path Path containing routing components (format: ':key').
 * Throws an error if any components aren't found in the pathParams object.
 * @param pathParams Object to transform into the supplied path.
 */
const replacePathParams = (path: string, pathParams: any) => {
    if (pathParams == null || path == null) {
        return path;
    }

    return path.replace(_routeParamRegEx, (a, b) => {
        const value = pathParams[b.substring(1)];

        if (value != null) {
            return value;
        }

        console.error(
            `routeUtils::getUrl cannot find value for path parameter ${a}`
        );

        return a;
    });
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export const RouteUtils = {
    absoluteToRelativePath,
    assertCurrentUrl,
    getCurrentRouteDefinition,
    getUrl,
    removeQueryString,
    replacePathParams,
};
