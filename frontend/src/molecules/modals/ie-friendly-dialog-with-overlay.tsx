import ModalCloseButton from "atoms/buttons/modal-close-button";
import { ModalCloseButtonStyle } from "molecules/constants/modal-close-button-style";
import { ModalTypes } from "molecules/constants/modal-types";
import { ModalProps } from "molecules/modals/modal";
import React, { PropsWithChildren } from "react";
import StringUtils from "utilities/string-utils";
import { DialogContent, DialogOverlay } from "@reach/dialog";

interface IEFriendlyDialogWithOverlayProps extends ModalProps {
    classNames: string[];
    closeButtonStyle?: ModalCloseButtonStyle;
    type: ModalTypes;
}

const IEFriendlyDialogWithOverlay: React.FunctionComponent<PropsWithChildren<
    IEFriendlyDialogWithOverlayProps
>> = (props: PropsWithChildren<IEFriendlyDialogWithOverlayProps>) => {
    const {
        classNames,
        closeButtonStyle,
        closeDialog,
        isVisible,
        label,
        type,
    } = props;
    return (
        <DialogOverlay
            allowPinchZoom={true}
            isOpen={isVisible}
            onDismiss={closeDialog}>
            <div className="c-modal-overlay">
                <DialogContent
                    aria-label={label}
                    className={StringUtils.joinClassNames(classNames)}>
                    <div className="c-modal__content">{props.children}</div>
                    {// if
                    closeButtonStyle != null &&
                        closeButtonStyle ===
                            ModalCloseButtonStyle.InsideDialog && (
                            <ModalCloseButton
                                modalType={type}
                                onClick={closeDialog}
                            />
                        )}
                    {// else
                    closeButtonStyle == null && (
                        <ModalCloseButton
                            modalType={type}
                            onClick={closeDialog}
                        />
                    )}
                </DialogContent>
            </div>
        </DialogOverlay>
    );
};

export default IEFriendlyDialogWithOverlay;
