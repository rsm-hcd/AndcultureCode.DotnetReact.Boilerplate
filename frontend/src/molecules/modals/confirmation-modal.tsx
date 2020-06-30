import Button, { ButtonTypes } from "atoms/buttons/button";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import Icon from "atoms/icons/icon";
import { ModalTransitions } from "molecules/constants/modal-transitions";
import { ModalTypes } from "molecules/constants/modal-types";
import Modal, { ModalProps } from "molecules/modals/modal";
import React from "react";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

interface ConfirmationModalProps {
    /**
     * ButtonStyles to use for cancel button
     *
     * @default ButtonStyles.Secondary
     */
    cancelButtonStyle?: ButtonStyles;

    /**
     * text or TSX element to render inside the cancel button
     */
    cancelButtonText?: string | React.ReactNode;

    /**
     * ButtonStyles to use for confirm button
     *
     * @default ButtonStyles.Destructive
     */
    confirmButtonStyle?: ButtonStyles;
    /**
     * text or TSX element to render inside the confirm button
     */
    confirmButtonText?: string | React.ReactNode;

    /**
     * controls modal visibility
     */
    isVisible: boolean;

    /**
     * the label/title of the modal, rendered at the top
     *
     * @default Confirm
     */
    label?: string;

    /**
     * the text or component to render in the body of the modal
     */
    message: string | React.ReactNode;

    /**
     * callback to execute when cancel button is clicked
     */
    onCancel: () => void;

    /**
     * callback to execute when onConfirm is clicked
     */
    onConfirm: () => void;

    /**
     * CSS transition to use
     *
     * @default ModalTransitions.Fade
     */
    transition?: ModalTransitions;

    /**
     * Modal type to use
     *
     * @default ModalTypes.Base
     */
    type?: ModalTypes;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

export const ConfirmationModal: React.FC<ConfirmationModalProps> = (
    props: ConfirmationModalProps
) => {
    const cssBaseClassName = "c-confirmation-modal";

    const {
        cancelButtonStyle,
        cancelButtonText,
        confirmButtonStyle,
        confirmButtonText,
        label,
        message,
        onCancel,
        onConfirm,
        transition,
        type,
    } = props;

    const modalPropsWithDefaults: ModalProps = Object.assign({}, props, {
        label: label ?? "Confirm",
        transition: transition ?? ModalTransitions.Fade,
        type: type ?? ModalTypes.Base,
        closeDialog: onCancel,
    });

    return (
        <Modal cssClassName={cssBaseClassName} {...modalPropsWithDefaults}>
            <div className={`${cssBaseClassName}__header`}>
                <h2>{modalPropsWithDefaults.label}</h2>
                <Button
                    style={ButtonStyles.TertiaryAlt}
                    size={ButtonSizes.Medium}
                    onClick={onCancel}
                    cssClassName={"-modal-close -icon"}
                    accessibleText="Close Dialog">
                    <Icon type={Icons.Close} size={IconSizes.Large} />
                </Button>
            </div>
            <div className={`${cssBaseClassName}__content`}>
                <div className={`${cssBaseClassName}__content__message`}>
                    {message}
                </div>
                <div className={`${cssBaseClassName}__footer`}>
                    <Button
                        type={ButtonTypes.Button}
                        onClick={onCancel}
                        style={cancelButtonStyle ?? ButtonStyles.Secondary}>
                        {cancelButtonText ?? "Cancel"}
                    </Button>
                    <Button
                        type={ButtonTypes.Button}
                        onClick={onConfirm}
                        style={confirmButtonStyle ?? ButtonStyles.Destructive}>
                        {confirmButtonText ?? "Confirm"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// #endregion Component
