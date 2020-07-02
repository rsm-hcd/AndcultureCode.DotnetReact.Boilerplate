import { InputTypes } from "atoms/constants/input-types";
import { InputProperties } from "atoms/interfaces/forms/input-properties";
import React from "react";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface TextInputProps extends InputProperties {
    id: string;
    maxLength?: number;
    name?: string;

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

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
    const {
        ariaLabelledBy,
        disabled,
        id,
        name,
        onChange,
        placeholder,
        testId,
        value,
    } = props;

    const maxLength = props.maxLength != null ? props.maxLength : 20;

    return (
        <input
            aria-labelledby={ariaLabelledBy}
            data-test-id={testId}
            disabled={disabled}
            id={id}
            placeholder={placeholder}
            maxLength={maxLength}
            name={name}
            onChange={onChange}
            type={InputTypes.Text}
            value={value}
        />
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default TextInput;
