import { InputProperties } from "atoms/interfaces/forms/input-properties";
import { InputTypes } from "atoms/constants/input-types";
import React from "react";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface PasswordInputProps extends InputProperties {
    id: string;
    isVisible: boolean;

    /**
     * Unique identifier used select the underlying <input> for functional/e2e testing
     */
    testId?: string;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const PasswordInput: React.FC<PasswordInputProps> = (
    props: PasswordInputProps
) => {
    const {
        disabled,
        id,
        isVisible,
        onChange,
        placeholder,
        testId,
        value,
    } = props;

    const type = isVisible ? InputTypes.Text : InputTypes.Password;

    return (
        <input
            data-test-id={testId}
            disabled={disabled}
            id={id}
            placeholder={placeholder}
            maxLength={20}
            onChange={onChange}
            type={type}
            value={value}
        />
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default PasswordInput;
