import Icon from "./icon";
import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import React from "react";
import { select } from "@storybook/addon-knobs";

export default {
    title: "Atoms | Icons / Icon",
    component: Icon,
};

export const icon = () => {
    return (
        <Icon
            type={select("type", Icons, Icons.Plus)}
            size={select("icon size", IconSizes, IconSizes.Large)}
        />
    );
};
