import React from "react";
import uuid from "uuid";
import {
    SelectOption,
    Select,
} from "andculturecode-javascript-react-components/dist/atoms/forms/select";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface SelectFormFieldProps {
    errorMessage?: string;
    errorMessages?: string[];
    fieldId?: string;
    id: string;
    isValid?: boolean;
    name?: string;
    label: string;
    onChange: (e: SelectOption<any> | undefined) => void;
    required?: boolean;
    values: SelectOption[];
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const SelectFormField: React.FC<SelectFormFieldProps> = (
    props: SelectFormFieldProps
) => {
    const {
        errorMessage,
        errorMessages,
        id,
        isValid,
        name,
        label,
        onChange,
        required,
        values,
    } = props;

    const fieldId = props.fieldId ?? uuid.v4();

    return (
        <div className={`c-form-field ${isValid ? "" : "-invalid"}`}>
            <label htmlFor={fieldId}>
                {label}
                {required ? "*" : ""}
            </label>
            <Select options={values} id={id} onChange={onChange} name={name} />
            <div className="c-form-field__errors">
                {// if
                errorMessage != null && errorMessage.length > 0 && (
                    <label>{errorMessage}</label>
                )}
                {// if
                errorMessages != null &&
                    errorMessages.map((s: string) => (
                        <label key={s}>{s}</label>
                    ))}
            </div>
        </div>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default SelectFormField;

// #endregion Exports
