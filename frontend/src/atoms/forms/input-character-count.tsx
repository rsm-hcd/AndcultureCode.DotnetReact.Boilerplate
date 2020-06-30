import React from "react";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface InputCharacterCountProps {
    currentLength: number;
    maxLength: number;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const InputCharacterCount: React.FC<InputCharacterCountProps> = (
    props: InputCharacterCountProps
) => {
    return (
        <div className="c-form-field__bottom__character-count">
            {props.currentLength}/{props.maxLength}
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default InputCharacterCount;

// #endregion Exports
