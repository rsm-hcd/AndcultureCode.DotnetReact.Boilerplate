import InputCharacterCount from "atoms/forms/input-character-count";
import { InputProperties } from "atoms/interfaces/forms/input-properties";
import React, { forwardRef, Ref, RefObject } from "react";
import uuid from "uuid";
import { InputTypes } from "atoms/constants/input-types";
import { CollectionUtils } from "utilities/collection-utils";
import StringUtils from "utilities/string-utils";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface InputFormFieldProps extends InputProperties {
    errorMessage?: string;
    errorMessages?: string[];

    /**
     * Unique identifier used select the underlying <input> for functional/e2e testing
     */
    inputTestId?: string;

    fieldId?: string;
    label: string;
    maxLength?: number;
    name?: string;
    ref?: RefObject<HTMLInputElement>;
    required?: boolean;
    showCharacterCount?: boolean;
    showLabelForScreenReadersOnly?: boolean;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const InputFormField: React.RefForwardingComponent<
    HTMLInputElement,
    InputFormFieldProps
> = forwardRef((props: InputFormFieldProps, ref: Ref<HTMLInputElement>) => {
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
        showCharacterCount,
        showLabelForScreenReadersOnly,
        type,
        value,
    } = props;

    const fieldId = props.fieldId ?? uuid.v4();

    return (
        <div className={`c-form-field ${isValid ? "" : "-invalid"}`}>
            <label htmlFor={fieldId}>
                {showLabelForScreenReadersOnly ? (
                    <span className="sr-only">{label}</span>
                ) : (
                    <React.Fragment>{label}</React.Fragment>
                )}
                {required && (
                    <span className="c-form-field__required">{" *"}</span>
                )}
            </label>
            <input
                data-test-id={inputTestId}
                disabled={disabled}
                id={fieldId}
                placeholder={placeholder}
                maxLength={maxLength ?? 20}
                name={name}
                onChange={onChange}
                ref={ref}
                type={type ?? InputTypes.Text}
                value={value}
            />
            <div className="c-form-field__bottom">
                <div className="c-form-field__bottom__errors">
                    {// if
                    StringUtils.hasValue(errorMessage) && (
                        <label>{errorMessage}</label>
                    )}
                    {// if
                    CollectionUtils.hasValues(errorMessages) &&
                        errorMessages?.map((s: string) => (
                            <label key={s}>{s}</label>
                        ))}
                </div>
                {// if
                showCharacterCount !== false && (
                    <InputCharacterCount
                        currentLength={(value ?? "").length}
                        maxLength={maxLength ?? 20}
                    />
                )}
            </div>
        </div>
    );
});

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default InputFormField;
