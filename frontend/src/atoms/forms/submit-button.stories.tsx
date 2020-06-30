import SubmitButton from "atoms/forms/submit-button";
import { text } from "@storybook/addon-knobs";
import React from "react";

export default {
    title: "Atoms | Forms / Submit Button",
    component: SubmitButton,
};

export const submitButtonKnobs = () => (
    <SubmitButton buttonText={text("Button Text", "Submit")} />
);
