import * as React from "react";

import Icon from "atoms/icons/icon";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface BreadcrumbProps {
    children: React.ReactNode;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({ children }) => {
    return (
        <React.Fragment>
            <Icon type={Icons.ChevronRight} size={IconSizes.Base} />
            {children}
        </React.Fragment>
    );
};

// #endregion Component

export default Breadcrumb;
