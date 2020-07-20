import {
    Heading,
    HeadingPriority,
} from "andculturecode-javascript-react-components";
import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React from "react";
import { useLocalization } from "andculturecode-javascript-react";
import CultureResources from "utilities/interfaces/culture-resources";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

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
    // const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className="c-login-layout__panel -left">
                <NewUserLoginForm />
            </div>
            <div className="c-login-layout__panel -right">
                <Heading priority={HeadingPriority.Two}>
                    {t("createAnAccount").toUpperCase()}
                </Heading>
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
