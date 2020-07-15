import { HeadingPriority } from "atoms/constants/heading-priority";
import { Icons, IconSizes } from "andculturecode-javascript-react-components";
import React from "react";
import { TestUtils } from "utilities/test-utils";
import { select } from "@storybook/addon-knobs";
import HeadingIcon from "./heading-icon";

export default {
    title: "Atoms | Typography / HeadingIcon",
    component: HeadingIcon,
};

export const headingIconDefault = () => (
    <HeadingIcon type={Icons.Plus} priority={2} iconSize={IconSizes.Base}>
        Voluptas Expedita Magnam
    </HeadingIcon>
);

export const headingIconKnobs = () => {
    const priorityOptions = TestUtils.numericEnumToPojo(HeadingPriority);

    return (
        <HeadingIcon
            type={select("type", Icons, Icons.Plus)}
            priority={
                select(
                    "priority",
                    priorityOptions,
                    HeadingPriority.One
                ) as HeadingPriority
            }
            iconSize={select("icon size", IconSizes, IconSizes.Large)}>
            Voluptas Expedita Magnam
        </HeadingIcon>
    );
};
