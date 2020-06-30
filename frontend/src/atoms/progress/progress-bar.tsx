import React from "react";
import StringUtils from "utilities/string-utils";

// -------------------------------------------------------------------------------------------------
// #region Enums
// -------------------------------------------------------------------------------------------------

export enum ProgressBarStyles {
    Thick = "-thick",
    Thin = "-thin",
}

// #endregion Enums

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

interface ProgressBarProps {
    cssClassName?: string;
    isErrored?: boolean;
    style?: ProgressBarStyles;
    value: number;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const ProgressBar: React.FC<ProgressBarProps> = (props: ProgressBarProps) => {
    const CSS_CLASS_NAME = "c-progress-bar";
    const classNames = [CSS_CLASS_NAME];

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    if (props.style != null) {
        classNames.push(props.style);
    }

    if (props.isErrored) {
        classNames.push("-error");
    }

    // value must be an integer 0 < value < 100
    let value = Math.round(props.value);

    if (value < 0) {
        value = 0;
    }

    if (value > 100) {
        value = 100;
    }

    return (
        <div className={classNames.join(" ")}>
            <div className={`${CSS_CLASS_NAME}__bar -w-${value}`} />
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default ProgressBar;

// #endregion Exports
