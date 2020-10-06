import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { siteMap } from "sitemap";
import {
    Button,
    ButtonStyles,
} from "andculturecode-javascript-react-components";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import { AuthenticationSchemes } from "constants/authentication-schemes";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const AUTHENTICATION_OPTIONS: AuthenticationOption[] = [
    // {
    //     name: "Google",
    //     scheme: AuthenticationSchemes.Google,
    // },
    // {
    //     name: "Microsoft",
    //     scheme: AuthenticationSchemes.Microsoft,
    // },
];
const COMPONENT_CLASS = "c-login-layout__panel";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

interface AuthenticationOption {
    name: string;
    scheme: AuthenticationSchemes;
}

interface NewUserLoginPageProps {}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const NewUserLoginPage: React.FC<NewUserLoginPageProps> = () => {
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);
    const { globalState } = useGlobalState();

    if (redirectToDashboard || globalState.isAuthenticated()) {
        return <Redirect to={siteMap.dashboards.user} />;
    }

    const handleLoginSuccess = () => setRedirectToDashboard(true);
    const handleLoginWith = (scheme: AuthenticationSchemes) =>
        (window.location.href = `${siteMap.userlogins.oauth}?returnUrl=${window.location.origin}&scheme=${scheme}`);

    return (
        <React.Fragment>
            <div className={`${COMPONENT_CLASS} -left`}>
                <NewUserLoginForm onSuccess={handleLoginSuccess} />
            </div>
            <div className={`${COMPONENT_CLASS} -right`}>
                {AUTHENTICATION_OPTIONS.map((option) => (
                    <Button
                        onClick={() => handleLoginWith(option.scheme)}
                        style={ButtonStyles.Secondary}>
                        Login with {option.name}
                    </Button>
                ))}
            </div>
        </React.Fragment>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default NewUserLoginPage;

// #endregion Exports
