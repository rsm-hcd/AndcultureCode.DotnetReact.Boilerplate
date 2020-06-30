import { select, text } from "@storybook/addon-knobs";

import Button from "atoms/buttons/button";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import Icon from "atoms/icons/icon";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import React from "react";

export default {
    title: "Atoms | Buttons",
    component: Button,
};

export const buttonDefault = () => (
    <Button
        onClick={() => {}}
        size={select("size", ButtonSizes, ButtonSizes.Medium)}
        style={select("style", ButtonStyles, ButtonStyles.Primary)}
        accessibleText={text("Accessible Text", "Text for screen reader")}>
        {text("Button Text", "Click Here!")}
    </Button>
);

export const buttonIcon = () => (
    <Button
        onClick={() => {}}
        size={select("size", ButtonSizes, ButtonSizes.Medium)}
        style={select("style", ButtonStyles, ButtonStyles.Primary)}
        accessibleText={text("Accessible Text", "Text for screen reader")}>
        <Icon
            type={select("type", Icons, Icons.Plus)}
            size={select("icon size", IconSizes, IconSizes.Large)}
        />
    </Button>
);
