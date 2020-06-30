import React, { Fragment } from "react";

import { Redirect } from "react-router";
import { RedirectDefinition } from "utilities/interfaces/redirect-definition";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

export interface RedirectsProps {
    redirects: RedirectDefinition[];
}

/*
---------------------------------------------------------------------------------------------
Components
---------------------------------------------------------------------------------------------
*/

/**
 * Simple way to redirect a flat array of RedirectDefinitions
 */
export const Redirects = (props: RedirectsProps) => {
    const redirects = props.redirects;

    // TODO: Remove Fragment when issue fixed https://github.com/microsoft/TypeScript/issues/21699
    return (
        <Fragment>
            {redirects.map((redirect: RedirectDefinition) => (
                <Redirect
                    key={redirect.from}
                    from={redirect.from}
                    to={redirect.to}
                />
            ))}
        </Fragment>
    );
};
