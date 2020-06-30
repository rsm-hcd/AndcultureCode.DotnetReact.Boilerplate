import React from "react";
import Faker from "faker";
import { addDecorator } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AnchorWithIcon from "atoms/anchors/anchor-with-icon";
import { Icons } from "atoms/constants/icons";
import { select, text } from "@storybook/addon-knobs";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";

addDecorator(StoryRouter());

export default {
    title: "Atoms | Anchors / AnchorWithIcon",
    component: AnchorWithIcon,
};

export const anchorIconWithChevronDownIcon = () => (
    <AnchorWithIcon
        accessibleText="Text for screen reader"
        size={ButtonSizes.Medium}
        style={ButtonStyles.Primary}
        icon={Icons.ChevronDown}
        to="/test">
        {Faker.lorem.words(5)}
    </AnchorWithIcon>
);

export const anchorIconKnobs = () => (
    <AnchorWithIcon
        accessibleText={text("accessibleText", "Text for screen reader")}
        size={select("size", ButtonSizes, ButtonSizes.Medium)}
        style={select("style", ButtonStyles, ButtonStyles.Primary)}
        icon={select("icon", Icons, Icons.ChevronDown)}
        to="/test">
        {text("text", "Anchor text")}
    </AnchorWithIcon>
);
