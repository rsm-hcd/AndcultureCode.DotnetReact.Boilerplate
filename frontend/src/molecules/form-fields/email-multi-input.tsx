import { KeyboardConstants } from "constants/keyboard-constants";
import React, { useState } from "react";
import Select, { OptionTypeBase, ValueType } from "react-select";
import makeAnimated from "react-select/animated";
import { CollectionUtils } from "utilities/collection-utils";
import StringUtils from "utilities/string-utils";
import { SelectOption } from "andculturecode-javascript-react-components/dist/atoms/forms/select";

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
    const CSS_CLASS_NAME = "c-email-multi-input";
    const classNames = [CSS_CLASS_NAME, "c-form-field", "c-multi-select"];

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    if (!props.isValid) {
        classNames.push("-invalid");
    }

    const [currentInputValue, setCurrentInputValue] = useState("");

    const options: Array<SelectOption> = props.emails.map((e: string) => ({
        label: e,
        value: e,
    }));

    const handleChange = (values: ValueType<OptionTypeBase>) => {
        props.onEmailsChanged(
            (values ?? []).map((o: OptionTypeBase) => o.value)
        );
    };

    const handleBlur = () => {
        if (StringUtils.isValidEmail(currentInputValue)) {
            props.onEmailsChanged([...props.emails, currentInputValue]);
        }

        setCurrentInputValue("");
    };

    const handleInputKeydown = (e: React.KeyboardEvent<HTMLElement>) => {
        // value is coming through react-select as the literal character instead of the name
        if (
            (e.key === KeyboardConstants.Comma ||
                e.key === "," ||
                e.key === KeyboardConstants.Space ||
                e.key === " " ||
                e.key === KeyboardConstants.Tab ||
                e.key === KeyboardConstants.Enter) &&
            StringUtils.hasValue(currentInputValue)
        ) {
            e.preventDefault();
            e.stopPropagation();
            const emailWithCommaStrippedOff = currentInputValue
                .replace(",", "")
                .trim();
            if (!StringUtils.isValidEmail(emailWithCommaStrippedOff)) {
                return false;
            }
            props.onEmailsChanged([...props.emails, emailWithCommaStrippedOff]);
            setCurrentInputValue("");
            return false;
        }
    };

    return (
        <div className={classNames.join(" ")}>
            <label>
                {props.label != null ? props.label : "Email Addresses"}
                {props.required === true && (
                    <span className="c-form-field__required"> *</span>
                )}
            </label>
            <Select
                isClearable={false}
                aria-label={props.label}
                escapeClearsValue={false}
                classNamePrefix="c-multi-select__input__selector"
                value={options}
                isDisabled={props.disabled}
                isMulti={true}
                components={animatedComponents}
                placeholder={props.placeholder ?? "Enter email addresses"}
                options={options}
                onChange={handleChange}
                inputValue={currentInputValue}
                onInputChange={setCurrentInputValue}
                onKeyDown={handleInputKeydown}
                onBlur={handleBlur}
            />
            <div className="c-form-field__bottom">
                <div className="c-form-field__bottom__errors">
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
