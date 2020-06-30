import CheckboxInput from "atoms/forms/checkbox-input";
import React from "react";
import { boolean, text } from "@storybook/addon-knobs";

export default {
    title: "Atoms | Forms / Checkbox Input",
    component: CheckboxInput,
};

export const checkboxInputKnobs = () => (
    <CheckboxInput
        checked={boolean("Checked", false)}
        label={text("Label", "Remember Me")}
        disabled={boolean("Disabled", false)}
        onChange={() => {}}
    />
);
