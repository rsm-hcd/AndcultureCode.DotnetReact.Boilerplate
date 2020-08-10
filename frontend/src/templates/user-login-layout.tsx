import * as React from "react";
import { NestedRoutes } from "andculturecode-javascript-react";
import { siteMap } from "sitemap";
import { useGlobalState } from "utilities/contexts/use-global-state-context";

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const UserLoginLayout: React.FC<any> = (props: any) => {
    const { globalState } = useGlobalState();

    return (
        <div className="c-login-layout">
            <NestedRoutes
                isAuthenticated={globalState.isAuthenticated()}
                redirectToIfNotFound={siteMap.errors.notFound}
                redirectToIfUnauthenticated={siteMap.errors.accessDenied}
                routes={props.routes}
            />
        </div>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default UserLoginLayout;

// #endregion Exports
