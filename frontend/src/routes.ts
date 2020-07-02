import UserDashboardPage from "pages/dashboards/user-dashboard";
import NotFoundPage from "pages/errors/not-found";
import NewUserLoginPage from "pages/userlogins/new-userlogin";
import { siteMap } from "sitemap";
import ApplicationLayout from "templates/application-layout";
import UserLoginLayout from "templates/user-login-layout";
import { RouteMap } from "utilities/interfaces/route-map";
import HomePage from "pages/home/home";

/*
---------------------------------------------------------------------------------------------
Routing Table
---------------------------------------------------------------------------------------------
*/

export const routes: RouteMap = {
    /**
     * Anything that doesn't use ApplicationLayout will
     * need to be placed before the `root` route,
     * such that the <Switch> component picks up the desired
     * layout before the ApplicationLayout, since the `home`
     * route is just "/"
     */

    // errors
    notFound: {
        authRequired: false,
        component: NotFoundPage,
        exact: true,
        path: siteMap.errors.notFound,
        routes: {},
    },

    // userlogins
    userlogins: {
        authRequired: false,
        component: UserLoginLayout,
        path: siteMap.userlogins.index,
        routes: {
            new: {
                authRequired: false,
                component: NewUserLoginPage,
                path: siteMap.userlogins.new,
                routes: {},
            },
        },
    },

    // root
    root: {
        /**
         * Anything that uses ApplicationLayout can be nested under the root route.
         */
        authRequired: false,
        component: ApplicationLayout,
        path: siteMap.root,
        routes: {
            // home
            index: {
                authRequired: false,
                component: HomePage,
                exact: true,
                path: siteMap.root,
                routes: {},
            },
            // user dashboard
            user: {
                authRequired: true,
                component: UserDashboardPage,
                exact: true,
                path: siteMap.dashboards.user,
                routes: {},
            },
        },
    },
};
