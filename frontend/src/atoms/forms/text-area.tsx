import React from "react";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface TextAreaProps {
    disabled?: boolean;
    id: string;
    maxLength?: number;
    name?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;

    /**
     * Unique identifier used select the underlying <textarea> for functional/e2e testing
     */
    testId?: string;
    value?: string;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TextArea: React.FC<TextAreaProps> = (props: TextAreaProps) => {
    const {
        disabled,
        id,
        maxLength,
        name,
        onChange,
        placeholder,
        rows,
        testId,
        value,
    } = props;

    return (
        <textarea
            data-test-id={testId}
            disabled={disabled}
            id={id}
            maxLength={maxLength}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            value={value}
        />
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TextArea;

// #endregion Exports
