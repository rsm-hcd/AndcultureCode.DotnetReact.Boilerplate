import TextInput, { TextInputProps } from "atoms/forms/text-input";
import {
    Icon,
    Icons,
    IconSizes,
} from "andculturecode-javascript-react-components";
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
