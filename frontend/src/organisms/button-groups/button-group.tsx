import React, { PropsWithChildren } from "react";

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
    const CSS_CLASS_NAME = "c-button-group";
    const { children } = props;

    return (
        <div className={`${CSS_CLASS_NAME} ${props.cssClassName}`}>
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
