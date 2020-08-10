import * as React from "react";
import { SkipNavLink } from "@reach/skip-nav";
import { NestedRoutes } from "andculturecode-javascript-react";
import { siteMap } from "sitemap";
import { useGlobalState } from "utilities/contexts/use-global-state-context";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-application-layout";

// #endregion Constants

// ---------------------------------------------------------------------------------------------
// #region Component
// ---------------------------------------------------------------------------------------------

const ApplicationLayout: React.FC<any> = (props: any) => {
    const { globalState } = useGlobalState();

    return (
        <React.Fragment>
            <SkipNavLink>Skip to main content</SkipNavLink>
            <div className={COMPONENT_CLASS}>
                <div className={`${COMPONENT_CLASS}__panel`}>
                    <NestedRoutes
                        isAuthenticated={globalState.isAuthenticated()}
                        redirectToIfNotFound={siteMap.errors.notFound}
                        redirectToIfUnauthenticated={siteMap.userlogins.new}
                        routes={props.routes}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default ApplicationLayout;

// #endregion Exports
