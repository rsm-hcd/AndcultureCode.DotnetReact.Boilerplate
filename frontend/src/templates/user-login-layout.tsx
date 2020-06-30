import * as React from "react";

import { NestedRoutes } from "utilities/routing/nested-route";

const UserLoginLayout: React.FC<any> = (props: any) => {
    return (
        <div className="c-login-layout">
            <NestedRoutes redirectIfNotFound={true} routes={props.routes} />
        </div>
    );
};

export default UserLoginLayout;
