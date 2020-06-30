import React from "react";
import { text, boolean, number } from "@storybook/addon-knobs";
import TextInput from "atoms/forms/text-input";
import Faker from "faker";

export default {
    title: "Atoms | Forms / Text Input",
    component: TextInput,
};

export const textInputKnobs = () => (
    <TextInput
        disabled={boolean("Disabled", false)}
        id={Faker.random.uuid()}
        maxLength={number("Max Length", 30)}
        onChange={() => {}}
        placeholder={text("Placeholder", "Placeholder...")}
        value={text("Value", "Input Value")}
        isValid={boolean("Valid", true)}
    />
);
