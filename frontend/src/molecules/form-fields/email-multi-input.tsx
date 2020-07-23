import { KeyboardKeys } from "andculturecode-javascript-react-components";
import React, { useState } from "react";
import Select, { OptionTypeBase, ValueType } from "react-select";
import makeAnimated from "react-select/animated";
import { CollectionUtils, StringUtils } from "andculturecode-javascript-core";
import { SelectOption } from "andculturecode-javascript-react-components/dist/atoms/forms/select";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-email-multi-input";
const FORM_FIELD_CLASS = "c-form-field";
const KEYS = [
    KeyboardKeys.Comma,
    ",", // value is coming through react-select as the literal character instead of the name
    KeyboardKeys.Space,
    " ",
    KeyboardKeys.Tab,
    KeyboardKeys.Enter,
];
const MULTI_SELECT_CLASS = "c-multi-select";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface EmailMultiInputProps {
    cssClassName?: string;
    disabled?: boolean;
    emails: Array<string>;
    errorMessage?: string;
    errorMessages?: Array<string>;
    isValid?: boolean;
    label?: string;
    onEmailsChanged: (newValues: Array<string>) => void;
    placeholder?: string;
    required?: boolean;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const animatedComponents = makeAnimated();

const EmailMultiInput: React.FC<EmailMultiInputProps> = (
    props: EmailMultiInputProps
) => {
    const classNames = [COMPONENT_CLASS, FORM_FIELD_CLASS, MULTI_SELECT_CLASS];

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    if (!props.isValid) {
        classNames.push("-invalid");
    }

    const [currentInputValue, setCurrentInputValue] = useState("");
    const labelText = StringUtils.hasValue(props.label)
        ? props.label
        : "Email Addresses";

    const options: Array<SelectOption> = props.emails.map((e: string) => ({
        label: e,
        value: e,
    }));

    const placeholderText = props.placeholder ?? "Enter email addresses";

    // Event Handlers
    // --------------

    const handleBlur = () => {
        if (StringUtils.isValidEmail(currentInputValue)) {
            props.onEmailsChanged([...props.emails, currentInputValue]);
        }

        setCurrentInputValue("");
    };

    const handleChange = (values: ValueType<OptionTypeBase>) => {
        props.onEmailsChanged(
            (values ?? []).map((o: OptionTypeBase) => o.value)
        );
    };

    const handleInputKeydown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (!KEYS.includes(e.key) || !StringUtils.hasValue(currentInputValue)) {
            return false;
        }

        e.preventDefault();
        e.stopPropagation();

        const email = currentInputValue.replace(",", "").trim();
        if (!StringUtils.isValidEmail(email)) {
            return false;
        }

        props.onEmailsChanged([...props.emails, email]);
        setCurrentInputValue("");

        return false;
    };

    return (
        <div className={classNames.join(" ")}>
            <label>
                {labelText}
                {props.required && (
                    <span className={`${FORM_FIELD_CLASS}__required`}> *</span>
                )}
            </label>
            <Select
                aria-label={props.label}
                components={animatedComponents}
                classNamePrefix={`${MULTI_SELECT_CLASS}__input__selector`}
                escapeClearsValue={false}
                inputValue={currentInputValue}
                isClearable={false}
                isDisabled={props.disabled}
                isMulti={true}
                placeholder={placeholderText}
                onBlur={handleBlur}
                onChange={handleChange}
                onInputChange={setCurrentInputValue}
                onKeyDown={handleInputKeydown}
                options={options}
                value={options}
            />
            <div className={`${FORM_FIELD_CLASS}__bottom`}>
                <div className={`${FORM_FIELD_CLASS}__bottom__errors`}>
                    {// if
                    StringUtils.hasValue(props.errorMessage) && (
                        <label>{props.errorMessage}</label>
                    )}
                    {// if
                    CollectionUtils.hasValues(props.errorMessages) &&
                        props.errorMessages?.map((s: string) => (
                            <label key={s}>{s}</label>
                        ))}
                </div>
            </div>
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default EmailMultiInput;

// #endregion Exports
