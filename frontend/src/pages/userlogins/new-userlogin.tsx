import { HeadingPriority } from "atoms/constants/heading-priority";
import Heading from "atoms/typography/heading";
import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React from "react";
import { useLocalization } from "andculturecode-javascript-react";
import CultureResources from "utilities/interfaces/culture-resources";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

interface NewUserLoginPageProps {}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const NewUserLoginPage: React.FC<NewUserLoginPageProps> = () => {
    const { t } = useLocalization<CultureResources>();

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

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default NewUserLoginPage;
