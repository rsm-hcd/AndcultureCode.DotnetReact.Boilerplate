import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React from "react";
import { useLocalization } from "andculturecode-javascript-react";
import CultureResources from "utilities/interfaces/culture-resources";

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
    const { t } = useLocalization<CultureResources>();

    return (
        <React.Fragment>
            <div className={`${COMPONENT_CLASS} -left`}>
                <NewUserLoginForm />
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
