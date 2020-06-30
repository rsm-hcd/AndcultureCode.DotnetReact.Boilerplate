import { InputTypes } from "atoms/constants/input-types";
import React from "react";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface CheckboxInputProperties {
    checked: boolean;
    disabled?: boolean;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const BASE_CLASS_NAME = "e-checkbox";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const CheckboxInput: React.FC<CheckboxInputProperties> = (
    props: CheckboxInputProperties
) => {
    const { checked, disabled, label, onChange } = props;
    let className = BASE_CLASS_NAME;
    if (disabled) {
        className += " -disabled";
    }

    return (
        <label className={className}>
            {label}
            <input
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                type={InputTypes.Checkbox}
                value={checked.toString()}
            />
            <span className={`${BASE_CLASS_NAME}__checkmark`}></span>
        </label>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export default CheckboxInput;

// #endregion Export
