import React from "react";
import uuid from "uuid";
import { TextArea } from "andculturecode-javascript-react-components";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface TextAreaFormFieldProps {
    disabled?: boolean;
    errorMessage?: string;
    errorMessages?: string[];
    fieldId?: string;
    /**
     * Unique identifier used select the underlying <input> for functional/e2e testing
     */
    inputTestId?: string;
    isValid?: boolean;
    label: string;
    maxLength?: number;
    name?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    value?: string;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TextAreaFormField: React.FC<TextAreaFormFieldProps> = (
    props: TextAreaFormFieldProps
) => {
    const {
        disabled,
        errorMessage,
        errorMessages,
        inputTestId,
        isValid,
        label,
        maxLength,
        name,
        onChange,
        placeholder,
        required,
        rows,
        value,
    } = props;

    const fieldId = props.fieldId ?? uuid.v4();

    return (
        <div className={`c-form-field ${isValid ? "" : "-invalid"}`}>
            <label htmlFor={fieldId}>
                {label}
                {required ? "*" : ""}
            </label>
            <TextArea
                disabled={disabled}
                id={fieldId}
                testId={inputTestId}
                maxLength={maxLength}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                value={value}
            />
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

export default TextAreaFormField;

// #endregion Exports
