import UserDashboardPage from "pages/dashboards/user-dashboard";
import NotFoundPage from "pages/errors/not-found";
import NewUserLoginPage from "pages/userlogins/new-userlogin";
import { siteMap } from "sitemap";
import ApplicationLayout from "templates/application-layout";
import UserLoginLayout from "templates/user-login-layout";
import { RouteMap } from "utilities/interfaces/route-map";

/*
---------------------------------------------------------------------------------------------
Routing Table
---------------------------------------------------------------------------------------------
*/

export const routes: RouteMap = {
    /**
     * Anything that doesn't use ApplicationLayout will
     * need to be placed before the `home` route,
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
    //home
    home: {
        /**
         * anything that uses ApplicationLayout can be nested under the home route, so that we can avoid
         * needing blank index pages that don't do anything just to use the layout.
         *
         * authRequired needs to be false for the top-level home route, i.e. "/", otherwise
         * it will try to check auth at "/" level, so "/userlogins/new" will try to
         * check auth, resulting in an infinite redirect loop
         */
        authRequired: false,
        component: ApplicationLayout,
        path: siteMap.home,
        routes: {
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
