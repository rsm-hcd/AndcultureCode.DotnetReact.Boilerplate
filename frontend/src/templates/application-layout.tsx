import * as React from "react";
import { NestedRoutes } from "utilities/routing/nested-route";
import { SkipNavLink } from "@reach/skip-nav";

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const ApplicationLayout: React.FC<any> = (props: any) => {
    return (
        <React.Fragment>
            <SkipNavLink>Skip to main content</SkipNavLink>
            <div className="c-application-layout">
                <div className="c-application-layout__panel">
                    <NestedRoutes
                        redirectIfNotFound={true}
                        routes={props.routes}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default ApplicationLayout;
