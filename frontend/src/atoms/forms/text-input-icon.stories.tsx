import { boolean, select } from "@storybook/addon-knobs";
import { Icons, IconSizes } from "andculturecode-javascript-react-components";
import TextInputIcon from "atoms/forms/text-input-icon";
import React from "react";

export default {
    title: "Atoms | Forms / Text Input Icon",
    component: TextInputIcon,
};

export const textInputIconKnobs = () => (
    <TextInputIcon
        // icon={select("Icon", Icons, Icons.Search)} TODO: Uncomment when AndcultureCode components gets icons
        icon={select("Icon", Icons, Icons.Checkmark)}
        iconSize={boolean("Icon Size", true) ? IconSizes.Large : IconSizes.Base}
        id="text-input-icon-stories"
        onChange={() => {}}
        placeholder="Type to search..."
    />
);
