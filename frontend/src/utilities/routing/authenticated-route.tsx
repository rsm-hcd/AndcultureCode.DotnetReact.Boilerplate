import * as React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { routes } from "routes";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import { RouteDefinition } from "utilities/interfaces/route-definition";

/*
-------------------------------------------------------------------------
Interfaces
-------------------------------------------------------------------------
*/

interface AuthenticatedRouteProps extends RouteComponentProps<any> {
    route: RouteDefinition;
    render: (props: any) => any;
}

/*
-------------------------------------------------------------------------
Components
-------------------------------------------------------------------------
*/

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
    render,
    route,
    ...rest
}) => {
    const { globalState } = useGlobalState();
    const isAuthenticated = globalState.isAuthenticated();

    const renderIfAuthenticated = (props: any): any => {
        if (!isAuthenticated) {
            return (
                <Redirect
                    to={{
                        pathname: routes.userlogins.routes.new.path,
                        state: { from: props.location },
                    }}
                />
            );
        }

        return render(props);
    };

    return <Route {...rest} render={renderIfAuthenticated} />;
};

export default AuthenticatedRoute;
