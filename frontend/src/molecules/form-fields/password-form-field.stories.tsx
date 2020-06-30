import { text, boolean } from "@storybook/addon-knobs";
import React from "react";
import PasswordFormField from "molecules/form-fields/password-form-field";

export default {
    title: "Molecules | Forms / Password Form Field",
    component: PasswordFormField,
};

export const passwordFormFieldKnobs = () => (
    <PasswordFormField
        disabled={boolean("Disabled", false)}
        errorMessage={text("Error Message", "")}
        label={text("Label", "Password")}
        onChange={() => {}}
        placeholder={text("Placeholder", "Placeholder...")}
        required={boolean("Required", true)}
        value={text("Value", "Password")}
        isValid={boolean("Valid", true)}
    />
);
