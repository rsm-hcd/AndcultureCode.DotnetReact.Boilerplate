import "assets/scss/app.scss";
import "react-toastify/dist/ReactToastify.min.css";
import GlobalStateRecord from "models/view-models/global-state-record";
import React, { useEffect, useRef, useState } from "react";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    useLocation,
} from "react-router-dom";
import { ToastContainer, ToastPosition, Zoom } from "react-toastify";
import { routes } from "routes";
import { siteMap } from "sitemap";
import GlobalStateContext, {
    useGlobalState,
} from "utilities/contexts/use-global-state-context";
import { CoreUtils } from "utilities/core-utils";
import { RouteUtils } from "utilities/route-utils";
import {
    NestedRoutes,
    NestedRoutesByProperty,
} from "utilities/routing/nested-route";
import { ScrollUtils } from "utilities/scroll-utils";
import ServiceUtils from "utilities/service-utils";
import { ServiceUtils as AndcultureCodeServiceUtils } from "andculturecode-javascript-core";
import { LocalizationUtils } from "andculturecode-javascript-core";
import { initReactI18next } from "react-i18next";
import EnglishUnitedStates from "cultures/english-united-states";
import SpanishSpain from "cultures/spanish-spain";
import CultureResources from "utilities/interfaces/culture-resources";

// -----------------------------------------------------------------------------------------
// #region Application Component
// -----------------------------------------------------------------------------------------

const App: React.FC = () => {
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

    const routeArray = CoreUtils.objectToArray(routes);
    const flattenedRoutes = RouteUtils.getFlattenedRoutes(routeArray);

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
                        {/* <Redirect
                            from={siteMap.home}
                            to={siteMap.dashboards.user}
                            exact={true}
                        /> */}
                        <NestedRoutes
                            redirectIfNotFound={true}
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

        // Reset the focus back to the document root element on page change so tabbing
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
