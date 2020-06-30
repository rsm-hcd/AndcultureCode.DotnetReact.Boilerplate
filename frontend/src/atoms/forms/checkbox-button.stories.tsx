import React from "react";
import { boolean, text } from "@storybook/addon-knobs";
import CheckboxButton from "atoms/forms/checkbox-button";

export default {
    title: "Atoms | Forms / Checkbox Button",
    component: CheckboxButton,
};

export const checkboxButtonKnobs = () => (
    <CheckboxButton
        checked={boolean("Checked", false)}
        label={text("Label", "Option 1")}
        disabled={boolean("Disabled", false)}
        onChange={() => {}}
    />
);
