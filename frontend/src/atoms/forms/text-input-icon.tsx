import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import TextInput, { TextInputProps } from "atoms/forms/text-input";
import Icon from "atoms/icons/icon";
import React from "react";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface TextInputIconProps extends TextInputProps {
    icon: Icons;
    iconSize?: IconSizes;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const TextInputIcon: React.FC<TextInputIconProps> = (
    props: TextInputIconProps
) => {
    return (
        <div className="c-text-input-icon">
            <Icon type={props.icon} size={props.iconSize || IconSizes.Large} />
            <TextInput {...props} />
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default TextInputIcon;

// #endregion Exports
