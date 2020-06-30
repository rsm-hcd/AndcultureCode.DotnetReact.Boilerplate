import CheckboxInput, {
    CheckboxInputProperties,
} from "atoms/forms/checkbox-input";
import React from "react";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface CheckboxFormFieldProperties extends CheckboxInputProperties {
    /**
     * An error message to display under the current checkbox with more information.
     *
     * @type {string}
     * @memberof CheckboxFormFieldProperties
     */
    errorMessage?: string;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const CheckboxFormField: React.FC<CheckboxFormFieldProperties> = (props) => {
    const { checked, disabled, errorMessage, label, onChange } = props;

    return (
        <div className="c-form-field">
            <CheckboxInput
                checked={checked}
                disabled={disabled}
                label={label}
                onChange={onChange}
            />
            {errorMessage != null && (
                <div className="c-form-field__errors">
                    <label>{errorMessage}</label>
                </div>
            )}
        </div>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default CheckboxFormField;
