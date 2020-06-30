import Button, { ButtonProps } from "atoms/buttons/button";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import Icon from "atoms/icons/icon";
import { ModalTypes } from "molecules/constants/modal-types";
import React from "react";

interface ModalCloseButtonProps extends ButtonProps {
    modalType: ModalTypes;
}

const defaultProps: Partial<ModalCloseButtonProps> = {
    accessibleText: "Close Dialog",
    cssClassName: "-modal-close",
    size: ButtonSizes.Medium,
    style: ButtonStyles.Tertiary,
};

const ModalCloseButton: React.FunctionComponent<ModalCloseButtonProps> = (
    props: ModalCloseButtonProps
) => {
    const {
        accessibleText,
        cssClassName,
        modalType,
        onClick,
        size,
        style,
    } = props;
    switch (modalType) {
        case ModalTypes.Bottom:
            return (
                <Button
                    accessibleText={accessibleText}
                    cssClassName={cssClassName}
                    onClick={onClick}
                    size={size}
                    style={style}>
                    Close
                </Button>
            );

        case ModalTypes.Left:
            return (
                <Button
                    accessibleText={accessibleText}
                    cssClassName={`${cssClassName} -icon`}
                    onClick={onClick}
                    size={size}
                    style={style}>
                    <Icon type={Icons.Close} size={IconSizes.Large} />
                </Button>
            );

        case ModalTypes.Fullscreen:
            return (
                <Button
                    accessibleText={accessibleText}
                    cssClassName={`${cssClassName} -icon`}
                    onClick={onClick}
                    size={size}
                    style={style}>
                    <Icon type={Icons.Close} size={IconSizes.Large} />
                </Button>
            );
    }

    return null;
};

ModalCloseButton.defaultProps = defaultProps;

export default ModalCloseButton;
