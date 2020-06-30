import ModalCloseButton from "atoms/buttons/modal-close-button";
import {
    AnimatePresence,
    MotionProps,
    Transition,
    motion,
} from "framer-motion";
import { ModalCloseButtonStyle } from "molecules/constants/modal-close-button-style";
import { ModalTransitions } from "molecules/constants/modal-transitions";
import { ModalTypes } from "molecules/constants/modal-types";
import IEFriendlyDialogWithOverlay from "molecules/modals/ie-friendly-dialog-with-overlay";
import React, {
    PropsWithChildren,
    Ref,
    RefObject,
    forwardRef,
    useEffect,
} from "react";
import { BrowserUtils } from "utilities/browser-utils";
import { Breakpoints } from "utilities/enumerations/breakpoints";
import StringUtils from "utilities/string-utils";
import Dialog, { DialogContent, DialogOverlay } from "@reach/dialog";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface ModalProps {
    closeButtonStyle?: ModalCloseButtonStyle;
    closeDialog: () => void;
    cssClassName?: string;
    isVisible: boolean;
    label: string;
    ref?: RefObject<HTMLDivElement>;
    style?: React.CSSProperties;
    transition?: ModalTransitions;
    type: ModalTypes;
    useDialogOverlay?: boolean;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const defaultProps: Partial<ModalProps> = {
    useDialogOverlay: true,
};

// #endregion Constants

/**
 * Forwards the div ref for the .c-modal__content div
 */
const Modal: React.RefForwardingComponent<
    HTMLDivElement,
    PropsWithChildren<ModalProps>
> = forwardRef(
    (props: PropsWithChildren<ModalProps>, ref: Ref<HTMLDivElement>) => {
        const {
            closeButtonStyle,
            closeDialog,
            cssClassName,
            isVisible,
            label,
            transition,
            type,
        } = props;
        const classNames = ["c-modal"];

        // -----------------------------------------------------------------------------------------
        // #region Side Effects
        // -----------------------------------------------------------------------------------------

        useEffect(() => {
            if (
                isVisible &&
                window.innerWidth < Breakpoints.Phone &&
                type !== ModalTypes.Bottom
            ) {
                // Counteract Android Chrome's auto page scrolling that throws off the modal position
                window.setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 5);
            }
        }, [isVisible, type]);

        // #endregion Side Effects

        const smoothTransition: Transition = { type: "tween", duration: 0.2 };

        let fadeIn: MotionProps = {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        };

        const slideUp: MotionProps = {
            initial: {
                bottom: 0,
                height: "100%",
                maxHeight: "100%",
                position: "absolute",
                display: "flex",
                width: "100%",
                y: "100%",
            },
            animate: { y: 0, transition: smoothTransition },
            exit: { y: "100%", transition: smoothTransition },
            transition: smoothTransition,
        };

        const slideRight: MotionProps = {
            initial: { x: "-100%" },
            animate: { x: 0 },
            exit: { x: "-100%" },
            transition: smoothTransition,
        };

        if (StringUtils.hasValue(cssClassName)) {
            classNames.push(cssClassName!);
        }

        if (type != null) {
            classNames.push(type);
        }

        let modalTransition;

        switch (transition) {
            case ModalTransitions.Fade:
                modalTransition = fadeIn;
                break;
            case ModalTransitions.SlideRight:
                modalTransition = slideRight;
                break;
            case ModalTransitions.SlideUp:
                modalTransition = slideUp;
                break;
            case ModalTransitions.None:
            default:
                modalTransition = {};
        }

        // -----------------------------------------------------------------------------------------
        // #region Component
        // -----------------------------------------------------------------------------------------

        // Not yet supporting animations
        if (!props.useDialogOverlay) {
            return (
                <Dialog
                    allowPinchZoom={true}
                    aria-label={label}
                    className={StringUtils.joinClassNames(classNames)}
                    isOpen={isVisible}
                    onDismiss={closeDialog}>
                    <div className="c-modal__content" ref={ref}>
                        {props.children}
                    </div>

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
                </Dialog>
            );
        }

        // This is not a long term solution, browser detection should be a last resort.
        if (BrowserUtils.isIE()) {
            return (
                <IEFriendlyDialogWithOverlay
                    {...props}
                    classNames={classNames}
                    closeButtonStyle={closeButtonStyle}
                    type={type}
                />
            );
        }

        return (
            <AnimatePresence>
                {isVisible && (
                    <DialogOverlay
                        allowPinchZoom={true}
                        isOpen={isVisible}
                        onDismiss={closeDialog}>
                        <motion.div
                            key="modal"
                            {...fadeIn}
                            className="c-modal-overlay">
                            {// if
                            closeButtonStyle != null &&
                                closeButtonStyle ===
                                    ModalCloseButtonStyle.OutsideDialog && (
                                    <ModalCloseButton
                                        modalType={type}
                                        onClick={closeDialog}
                                    />
                                )}
                            <motion.div {...modalTransition}>
                                <DialogContent
                                    aria-label={label}
                                    className={StringUtils.joinClassNames(
                                        classNames
                                    )}>
                                    <div className="c-modal__content" ref={ref}>
                                        {props.children}
                                    </div>
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
                            </motion.div>
                        </motion.div>
                    </DialogOverlay>
                )}
            </AnimatePresence>
        );
        // #endregion Component
    }
);

Modal.defaultProps = defaultProps;

export default Modal;
