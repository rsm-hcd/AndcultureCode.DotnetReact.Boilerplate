import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React from "react";
import IdentityRecord from "models/view-models/identity-record";

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
    const handleLoginSuccess = (identity: IdentityRecord) => {
        window.alert("SIGNED IN!!!");
    };

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
