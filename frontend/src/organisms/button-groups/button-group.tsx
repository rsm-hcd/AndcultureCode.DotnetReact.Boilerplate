import React, { PropsWithChildren } from "react";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-button-group";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

/**
 * Note that all children must be <Button> components
 */
export interface ButtonGroupProps {
    cssClassName?: string;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const ButtonGroup: React.FC<PropsWithChildren<ButtonGroupProps>> = (
    props: PropsWithChildren<ButtonGroupProps>
) => {
    const { children } = props;

    return (
        <div className={`${COMPONENT_CLASS} ${props.cssClassName}`}>
            {children}
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default ButtonGroup;

// #endregion Exports
