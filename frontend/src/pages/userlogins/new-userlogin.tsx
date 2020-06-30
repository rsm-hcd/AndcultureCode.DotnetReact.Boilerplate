import Anchor from "atoms/anchors/anchor";
import { HeadingPriority } from "atoms/constants/heading-priority";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import { ParagraphSizes } from "atoms/constants/paragraph-sizes";
import Icon from "atoms/icons/icon";
import Heading from "atoms/typography/heading";
import Paragraph from "atoms/typography/paragraph";
import NewUserLoginForm from "organisms/userlogins/userlogins-new-form/userlogins-new-form";
import React from "react";
import { Redirect } from "react-router-dom";
import { siteMap } from "sitemap";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import { RouteUtils } from "utilities/route-utils";
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
    const { globalState } = useGlobalState();
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
