import {
    ButtonSizes,
    ButtonStyles,
} from "andculturecode-javascript-react-components";
import React from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import uuid from "uuid";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface DropdownItem {
    component: string | React.ReactNode | React.ReactNodeArray;
    onSelect: () => void;
}

export interface DropdownButtonProps {
    buttonClassName?: string;
    menuItems: Array<DropdownItem>;
    size?: ButtonSizes;
    style?: ButtonStyles;
    buttonContents: string | React.ReactNode | React.ReactNodeArray;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const DropdownButton: React.FC<DropdownButtonProps> = (
    props: DropdownButtonProps
) => {
    const { buttonClassName, menuItems, buttonContents, size, style } = props;

    const classNames = ["c-button", "c-dropdown-button"];

    if (buttonClassName != null) {
        classNames.push(buttonClassName);
    }

    if (size != null) {
        classNames.push(size);
    }

    if (style != null) {
        classNames.push(style);
    }

    return (
        <Menu>
            <MenuButton className={classNames.join(" ")}>
                {buttonContents}
            </MenuButton>
            <MenuList className="c-dropdown-button__list">
                {menuItems.map((item: DropdownItem) => (
                    <MenuItem
                        key={uuid.v4()}
                        onSelect={item.onSelect}
                        className={"c-dropdown-button__list__item"}>
                        {item.component}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default DropdownButton;

// #endregion Exports
