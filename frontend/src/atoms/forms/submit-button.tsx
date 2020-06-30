import React from "react";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface SubmitButtonProps {
    buttonText?: string;
    cssClassName?: string;

    /**
     * Typically you do not need this, but using it can allow you to
     * place the button outside of the form for styling purposes.
     */
    formId?: string;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const SubmitButton: React.FC<SubmitButtonProps> = (
    props: SubmitButtonProps
) => {
    return (
        <input
            className={props.cssClassName || "c-button"}
            form={props.formId}
            type="submit"
            value={props.buttonText || "Submit"}
        />
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default SubmitButton;
