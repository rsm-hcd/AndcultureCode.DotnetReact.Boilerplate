import * as React from "react";

import {
    Icon,
    Icons,
    IconSizes,
} from "andculturecode-javascript-react-components";

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
