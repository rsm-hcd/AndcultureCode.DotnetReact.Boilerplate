import "assets/scss/app.scss";
import "react-toastify/dist/ReactToastify.min.css";
import GlobalStateRecord from "models/view-models/global-state-record";
import React, { useEffect, useRef, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    useLocation,
    Redirect,
} from "react-router-dom";
import { ToastContainer, ToastPosition, Zoom } from "react-toastify";
import { routes } from "routes";
import GlobalStateContext, {
    useGlobalState,
} from "utilities/contexts/use-global-state-context";
import ServiceUtils from "utilities/service-utils";
import {
    CoreUtils,
    LocalizationUtils,
    ScrollUtils,
    ServiceUtils as AndcultureCodeServiceUtils,
    StringUtils,
} from "andculturecode-javascript-core";
import { initReactI18next } from "react-i18next";
import EnglishUnitedStates from "cultures/english-united-states";
import SpanishSpain from "cultures/spanish-spain";
import CultureResources from "utilities/interfaces/culture-resources";
import { IconUtils } from "andculturecode-javascript-react-components";
import { SvgIcons } from "atoms/constants/svg-icons";
import { siteMap } from "sitemap";
import {
    NestedRoutesByProperty,
    NestedRoutes,
    RouteUtils,
} from "andculturecode-javascript-react";
import { AppConstants } from "constants/app-constants";
import UserLoginService from "utilities/services/user-login-service";
import useIdentity from "utilities/hooks/use-identity";

// -----------------------------------------------------------------------------------------
// #region Application Component
// -----------------------------------------------------------------------------------------

const App: React.FC = () => {
    const { getIdentity } = useIdentity();
    const { get: getUserLoginApi } = UserLoginService.useGetFromCookie();
    const [loading, setLoading] = useState(true);

    const globalStateRecord = getInitialGlobalState();
    const [globalState, setGlobalState] = useState(globalStateRecord);

    LocalizationUtils.initialize<CultureResources>(initReactI18next, [
        EnglishUnitedStates,
        SpanishSpain,
    ]);

    ServiceUtils.configure({
        cultureCode: LocalizationUtils.detectCultureCode(),
        globalState,
        setGlobalState,
    });

    IconUtils.register(SvgIcons);

    const routeArray = CoreUtils.objectToArray(routes);
    const flattenedRoutes = RouteUtils.getFlattenedRoutes(routeArray);

    // Detect cookie
    useEffect(() => {
        const getUserLogin = async () => {
            const userLoginResult = (await getUserLoginApi({})).result;

            if (
                userLoginResult?.hasErrors() ||
                userLoginResult?.resultObject == null
            ) {
                setLoading(false);
                return;
            }

            const userLogin = userLoginResult?.resultObject;
            const identity = await getIdentity(userLogin);

            setGlobalState((state) => state.setIdentity(identity));
            setLoading(false);
        };

        if (
            globalState.isAuthenticated() ||
            !hasCookie(AppConstants.AuthenticationCookieName)
        ) {
            setLoading(false);
            return;
        }

        getUserLogin();
    }, [getUserLoginApi, globalState, getIdentity]);

    if (loading) {
        return null;
    }

    return (
        <Router>
            <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
                <PageViews />
                <React.Fragment>
                    {/*
                    ------------------------------------------------------------------------------------------
                    Sidebar - if assigned to route
                    ------------------------------------------------------------------------------------------
                    This is here merely to convey the idea that you can extend RouteDefinitions to make
                    portions of your application more dyanmic and driven by routing.
                    */}
                    <Switch>
                        <Redirect
                            exact={true}
                            from={siteMap.root}
                            to={siteMap.userlogins.new}
                        />
                        <NestedRoutesByProperty
                            propertyName="sidebar"
                            routes={flattenedRoutes}
                        />
                    </Switch>

                    {/*
                    ------------------------------------------------------------------------------------------
                    Main Content
                    ------------------------------------------------------------------------------------------
                    */}
                    <Switch>
                        <NestedRoutes
                            isAuthenticated={globalState.isAuthenticated()}
                            redirectToIfNotFound={siteMap.errors.notFound}
                            redirectToIfUnauthenticated={siteMap.userlogins.new}
                            routes={routeArray}
                        />
                    </Switch>
                    <ToastContainer
                        draggable={false}
                        position={ToastPosition.BOTTOM_RIGHT}
                        autoClose={5000}
                        closeOnClick={true}
                        closeButton={false}
                        transition={Zoom}
                        toastClassName="c-toast"
                    />
                </React.Fragment>
            </GlobalStateContext.Provider>
        </Router>
    );
};

// #endregion Application Component

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

/**
 * TODO: Abstract to AndcultureCode.JavaScript.Core https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/issues/41
 * @param cookieName
 */
const getCookie = (cookieName: string) => {
    let name = cookieName + "=";
    const parts = document.cookie.split(";");

    for (let i = 0; i < parts.length; i++) {
        let cookie = parts[i];

        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return "";
};

/**
 * TODO: Abstract to AndcultureCode.JavaScript.Core https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/issues/41
 * @param cookieName
 */
const hasCookie = (cookieName: string) =>
    StringUtils.hasValue(getCookie(cookieName));

const getInitialGlobalState = () =>
    new GlobalStateRecord().setFromLocalStorage();

const PageViews = () => {
    let currentLocation = useRef("");
    let location = useLocation();
    const { globalState, setGlobalState } = useGlobalState();

    useEffect(() => {
        if (currentLocation.current === location.pathname) {
            return;
        }

        currentLocation.current = location.pathname;

        // Detect and configure application language
        const cultureCode = LocalizationUtils.detectCultureCode();
        AndcultureCodeServiceUtils.configureCultureCode(cultureCode);

        // re-opens the Skip to content accessibility option
        setFocusToRoot();
    }, [location, globalState, setGlobalState]);

    // Effect for scrolling to the hash in the route after the DOM has rendered.
    useEffect(() => ScrollUtils.scrollToHash(location), [location]);

    return null;
};

const setFocusToRoot = () => {
    var root = document.getElementById("root");

    if (root != null) {
        root.tabIndex = -1;
        root.focus();
    }
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default App;

// #endregion Export
