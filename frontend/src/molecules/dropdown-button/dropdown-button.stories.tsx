import { optionsKnob } from "@storybook/addon-knobs";
import {
    ButtonSizes,
    ButtonStyles,
    Icon,
    Icons,
} from "andculturecode-javascript-react-components";
import DropdownButton, {
    DropdownItem,
} from "molecules/dropdown-button/dropdown-button";
import React from "react";
import { ToastContainer, ToastPosition, Zoom } from "react-toastify";
import { ToastManager } from "utilities/toast/toast-manager";

export default {
    title: "Molecules | Dropdown Button",
    component: DropdownButton,
};

export const dropdownButtonKnobs = () => {
    const items: Array<DropdownItem> = [
        {
            component: "Item #1",
            onSelect: () => ToastManager.success("Clicked dropdown item #1!"),
        },
        {
            component: "Item #2",
            onSelect: () => ToastManager.success("Clicked dropdown item #2!"),
        },
        {
            component: "Item #3",
            onSelect: () => ToastManager.success("Clicked dropdown item #3!"),
        },
        {
            component: "Item #4",
            onSelect: () => ToastManager.success("Clicked dropdown item #4!"),
        },
        {
            component: "Item #5",
            onSelect: () => ToastManager.success("Clicked dropdown item #5!"),
        },
    ];

    return (
        <React.Fragment>
            <DropdownButton
                size={optionsKnob(
                    "Button Size",
                    {
                        small: ButtonSizes.Small,
                        medium: ButtonSizes.Medium,
                        large: ButtonSizes.Large,
                    },
                    ButtonSizes.Small,
                    { display: "radio" }
                )}
                style={optionsKnob(
                    "Button Style",
                    {
                        anchor: ButtonStyles.Anchor,
                        destructive: ButtonStyles.Destructive,
                        primary: ButtonStyles.Primary,
                        secondary: ButtonStyles.Secondary,
                        tertiary: ButtonStyles.Tertiary,
                        tertiaryAlt: ButtonStyles.TertiaryAlt,
                    },
                    ButtonStyles.Primary,
                    { display: "radio" }
                )}
                menuItems={items}
                buttonContents={
                    <React.Fragment>
                        Dropdown
                        <Icon type={Icons.ChevronDown} />
                    </React.Fragment>
                }
            />
            <ToastContainer
                draggable={false}
                position={ToastPosition.BOTTOM_RIGHT}
                autoClose={5000}
                closeOnClick={true}
                closeButton={false}
                transition={Zoom}
                toastClassName="c-toast"
            />
        </React.Fragment>
    );
};
