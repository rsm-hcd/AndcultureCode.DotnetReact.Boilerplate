import Button from "atoms/buttons/button";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import Icon from "atoms/icons/icon";
import { KeyboardConstants } from "constants/keyboard-constants";
import { ModalTransitions } from "molecules/constants/modal-transitions";
import { ModalTypes } from "molecules/constants/modal-types";
import Modal from "molecules/modals/modal";
import * as React from "react";
import { useEffect, useRef, useCallback } from "react";
import { BrowserUtils } from "utilities/browser-utils";
import { Breakpoints } from "utilities/enumerations/breakpoints";
import useOnClickOutside from "utilities/hooks/use-onclick-outside";

interface MenuButtonProps {
    children?: React.ReactNode;
    cssClassName?: string;

    /**
     * Icon to display as the underlying Button.
     *
     * @default {Icons.MoreVertical}
     * @type {Icons}
     * @memberof MenuButtonProps
     */
    icon?: Icons;

    /**
     * Size of icon to display
     * @default {IconSizes.Large}
     * @type {IconSizes}
     * @memberof MenuButtonProps
     */
    iconSize?: IconSizes;

    /**
     * Class name to apply to the modal on mobile layout.
     */
    modalClassName?: string;

    /**
     * Size of the button to trigger the menu
     *
     * @default {ButtonSizes.Medium}
     * @type {ButtonSizes}
     * @memberof MenuButtonProps
     */
    triggerButtonSize?: ButtonSizes;

    /**
     * Style of the button to trigger the menu
     *
     * @default ButtonStyles.None
     * @type {ButtonStyles}
     * @memberof MenuButtonProps
     */
    triggerButtonStyle?: ButtonStyles;
}

const MenuButton: React.FunctionComponent<MenuButtonProps> = (props) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [current, setCurrent] = React.useState<number>(0);
    const [focusFirstItem, setFocusFirstItem] = React.useState<boolean>(false);
    const cssBaseClass = "c-menu-button";
    const refArray: HTMLElement[] = [];
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const { icon, iconSize, triggerButtonSize, triggerButtonStyle } = props;

    useOnClickOutside(
        menuContainerRef,
        useCallback(() => setIsOpen(false), [])
    );

    useEffect(() => {
        const element = refArray[current];
        if (element == null || !focusFirstItem) {
            return;
        }

        element.focus();
    }, [refArray, current, isOpen, focusFirstItem]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (
            e.key === KeyboardConstants.DownArrow &&
            current !== refArray.length - 1
        ) {
            e.preventDefault();

            setCurrent(current + 1);
            return;
        }

        if (e.key === KeyboardConstants.UpArrow && current !== 0) {
            e.preventDefault();

            setCurrent(current - 1);
            return;
        }

        if (e.key === KeyboardConstants.Escape) {
            e.preventDefault();
            setCurrent(0);
            setIsOpen(false);
            buttonRef.current!.focus();
            return;
        }
    };

    const toggleModal = (focusFirst: boolean) => {
        setFocusFirstItem(focusFirst);
        setIsOpen(!isOpen);
    };

    const toggleModalKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (
            e.key === KeyboardConstants.Enter ||
            e.key === KeyboardConstants.Space
        ) {
            e.preventDefault();
            toggleModal(true);
            return;
        }
    };

    const renderChildren = () => {
        return React.Children.map(
            props.children,
            (child: React.ReactNode, index: number) => {
                if (!React.isValidElement(child)) {
                    return child;
                }

                return (
                    <span key={index} className={`${cssBaseClass}__item`}>
                        {React.cloneElement(child, {
                            ...child.props,
                            onClick: () => {
                                if (BrowserUtils.isIE()) {
                                    // setTimeout with a 0ms timeout just pushes it to
                                    // the end of the current event queue. This fixes
                                    // a null-reference error on IE
                                    setTimeout(() => setIsOpen(false), 0);
                                } else {
                                    setIsOpen(false);
                                }
                                if (child.props.onClick != null) {
                                    child.props.onClick();
                                }
                            },
                            onKeyDown: handleKeyDown,
                            ref: (el: HTMLElement) => (refArray[index] = el),
                        })}
                    </span>
                );
            }
        );
    };

    const transitionEffect =
        window.innerWidth < Breakpoints.Phone
            ? ModalTransitions.SlideUp
            : ModalTransitions.Fade;

    return (
        <div
            className={`${cssBaseClass} ${props.cssClassName}`}
            ref={menuContainerRef}>
            <Button
                cssClassName={`${cssBaseClass}__icon`}
                onClick={() => toggleModal(false)}
                onKeyDown={toggleModalKeyDown}
                ref={buttonRef}
                size={triggerButtonSize ?? ButtonSizes.Medium}
                style={triggerButtonStyle ?? ButtonStyles.None}>
                <Icon
                    size={iconSize ?? IconSizes.Large}
                    type={icon ?? Icons.MoreVertical}
                />
            </Button>
            {window.innerWidth <= Breakpoints.Phone ? (
                <Modal
                    closeDialog={() => setIsOpen(false)}
                    cssClassName={`${cssBaseClass} ${props.modalClassName ??
                        ""}`}
                    isVisible={isOpen}
                    label="Change Edition"
                    transition={transitionEffect}
                    type={ModalTypes.Bottom}>
                    {renderChildren()}
                </Modal>
            ) : (
                <React.Fragment>
                    {isOpen && (
                        <div className={`${cssBaseClass}__menu`}>
                            {renderChildren()}
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default MenuButton;
