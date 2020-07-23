import * as React from "react";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-application-sidebar";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface ApplicationSidebarProps {}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const ApplicationSidebar: React.FC<ApplicationSidebarProps> = (
    props: React.PropsWithChildren<ApplicationSidebarProps>
) => {
    return (
        <nav className={COMPONENT_CLASS}>
            <div className="__panel">{props.children}</div>
        </nav>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default ApplicationSidebar;

// #endregion Exports
