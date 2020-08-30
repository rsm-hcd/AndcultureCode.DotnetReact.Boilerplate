import UserDashboardPage from "pages/dashboards/user-dashboard-page";
import NotFoundPage from "pages/errors/not-found-page";
import NewUserLoginPage from "pages/userlogins/new-userlogin-page";
import { siteMap } from "sitemap";
import ApplicationLayout from "templates/application-layout";
import UserLoginLayout from "templates/user-login-layout";
import { RouteMap } from "andculturecode-javascript-react";
import HomePage from "pages/home/home-page";
import AccessDeniedPage from "pages/errors/access-denied-page";

/*
---------------------------------------------------------------------------------------------
Routing Table
---------------------------------------------------------------------------------------------
*/

export const routes: RouteMap = {
    root: {
        /**
         * Anything that uses ApplicationLayout can be nested under the root route.
         */
        authRequired: false,
        component: ApplicationLayout,
        path: siteMap.root,
        routes: {
            // home
            home: {
                authRequired: false,
                component: HomePage,
                exact: true,
                path: siteMap.root,
                routes: {},
            },

            // errors
            accessDenied: {
                authRequired: false,
                component: AccessDeniedPage,
                exact: true,
                path: siteMap.errors.accessDenied,
                routes: {},
            },

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
                        exact: true,
                        path: siteMap.userlogins.new,
                        routes: {},
                    },
                },
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
