import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import React, { forwardRef } from "react";

export enum ButtonTypes {
    Button = "button",
    Submit = "submit",
}

export interface ButtonProps {
    accessibleText?: string;
    ariaControls?: string;
    ariaExpanded?: boolean;
    children?: any;
    cssClassName?: string;
    disabled?: boolean;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onDrag?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onDrop?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    ref?: React.RefObject<HTMLButtonElement>;
    size?: ButtonSizes;
    style?: ButtonStyles;
    /**
     * useful when you need a non-submit button inside a form
     */
    type?: ButtonTypes;
    value?: string | number | string[] | undefined;
}

const Button: React.RefForwardingComponent<
    HTMLButtonElement,
    ButtonProps
> = forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const {
        accessibleText,
        ariaControls,
        ariaExpanded,
        children,
        cssClassName,
        disabled,
        id,
        onClick,
        size,
        style,
        type,
        value,
    } = props;

    const classNames = ["c-button"];

    if (style === ButtonStyles.None) {
        classNames[0] = "";
    }

    if (size != null) {
        classNames.push(size);
    }

    if (style != null) {
        classNames.push(style);
    }

    if (cssClassName != null && cssClassName.length > 0) {
        classNames.push(cssClassName);
    }

    return (
        <button
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            className={classNames.join(" ")}
            disabled={disabled}
            id={id}
            onClick={onClick}
            ref={ref}
            type={type}
            value={value}
            onKeyDown={props.onKeyDown}>
            {children}
            {accessibleText != null && (
                // if
                <span className="sr-only">{accessibleText}</span>
            )}
        </button>
    );
});

export default Button;
