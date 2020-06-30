import { boolean, select } from "@storybook/addon-knobs";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import TextInputIcon from "atoms/forms/text-input-icon";
import React from "react";

export default {
    title: "Atoms | Forms / Text Input Icon",
    component: TextInputIcon,
};

export const textInputIconKnobs = () => (
    <TextInputIcon
        icon={select("Icon", Icons, Icons.Search)}
        iconSize={boolean("Icon Size", true) ? IconSizes.Large : IconSizes.Base}
        id="text-input-icon-stories"
        onChange={() => {}}
        placeholder="Type to search..."
    />
);
