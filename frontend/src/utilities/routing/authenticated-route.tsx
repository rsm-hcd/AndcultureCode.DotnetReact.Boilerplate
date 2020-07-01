import AccessDeniedPage from "pages/errors/access-denied-page";
import * as React from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    useLocation,
} from "react-router-dom";
import { routes } from "routes";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import { RouteDefinition } from "utilities/interfaces/route-definition";
import { RouteUtils } from "utilities/route-utils";

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
    const { globalState, setGlobalState } = useGlobalState();
    const isAuthenticated = globalState.isAuthenticated();
    const location = useLocation();

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
