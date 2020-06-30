import React, { useState } from "react";

import { InputProperties } from "interfaces/forms/input-properties";
import PasswordInput from "atoms/forms/password-input";
import uuid from "uuid";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface PasswordFormFields extends InputProperties {
    errorMessage?: string;

    /**
     * Unique identifier used select the underlying <input> for functional/e2e testing
     */
    inputTestId?: string;

    label: string;
    required?: boolean;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const PasswordFormField: React.FC<PasswordFormFields> = (
    props: PasswordFormFields
) => {
    const {
        disabled,
        errorMessage,
        inputTestId,
        isValid,
        label,
        placeholder,
        onChange,
        required,
        value,
    } = props;

    const fieldId = uuid.v4();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const disableShowHide = value == null || value === "" || disabled;
    const passwordShowHideLabel = isVisible ? "Hide" : "Show";

    const onChangeIsVisible = (
        event: React.MouseEvent<Element, MouseEvent>
    ) => {
        event.preventDefault();

        setIsVisible(!isVisible);
    };

    if (disabled && isVisible === true) {
        setIsVisible(false);
    }

    return (
        <div className={`c-form-field -password ${isValid ? "" : "-invalid"}`}>
            <label htmlFor={fieldId}>
                {label}
                {required && (
                    <span className="c-form-field__required">{" *"}</span>
                )}
            </label>
            {// if
            !disableShowHide && (
                <button
                    type="button"
                    aria-label={`${passwordShowHideLabel} Password`}
                    onClick={(event) => onChangeIsVisible(event)}>
                    {passwordShowHideLabel}
                </button>
            )}
            <PasswordInput
                disabled={disabled}
                id={fieldId}
                isValid={isValid}
                isVisible={isVisible}
                onChange={onChange}
                placeholder={placeholder}
                testId={inputTestId}
                value={value}
            />
            <div className="c-form-field__bottom">
                <div className="c-form-field__bottom__errors">
                    <label>{errorMessage}</label>
                </div>
            </div>
        </div>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default PasswordFormField;
