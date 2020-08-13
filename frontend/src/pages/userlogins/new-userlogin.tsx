import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { siteMap } from "sitemap";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-login-layout__panel";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

interface NewUserLoginPageProps {}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const NewUserLoginPage: React.FC<NewUserLoginPageProps> = () => {
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);

    const handleLoginSuccess = () => setRedirectToDashboard(true);

    if (redirectToDashboard) {
        return <Redirect to={siteMap.dashboards.user} />;
    }

    return (
        <React.Fragment>
            <div className={`${COMPONENT_CLASS} -left`}>
                <NewUserLoginForm onSuccess={handleLoginSuccess} />
            </div>
            <div className={`${COMPONENT_CLASS} -right`}></div>
        </React.Fragment>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default NewUserLoginPage;

// #endregion Exports
