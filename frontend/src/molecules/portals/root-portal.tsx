import React, { HTMLAttributes, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface RootPortalProps extends HTMLAttributes<HTMLDivElement> {}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

/**
 * Utility component to portal children to the root div.
 * @param props any HTML div attributes, and children
 */
const RootPortal: React.FC<PropsWithChildren<RootPortalProps>> = (
    props: PropsWithChildren<RootPortalProps>
) => {
    const root = ReactDOM.findDOMNode(
        document.getElementById("root")
    ) as Element;

    return ReactDOM.createPortal(<div {...props}>{props.children}</div>, root);
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default RootPortal;

// #endregion Exports
