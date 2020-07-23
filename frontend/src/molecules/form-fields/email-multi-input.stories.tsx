import { text } from "@storybook/addon-knobs";
import EmailMultiInput from "molecules/form-fields/email-multi-input";
import React, { useState } from "react";
import { StringUtils } from "andculturecode-javascript-core";

export default {
    component: EmailMultiInput,
    title: "Molecules | Forms / Email Multi Input Form Field",
};

export const EmailMultiInputDefault = () => {
    const [emails, setEmails] = useState<Array<string>>([]);
    const labelKnob = text("Label", "");
    const label = StringUtils.hasValue(labelKnob) ? labelKnob : undefined;
    const placeholderKnob = text("Placeholder", "");
    const placeholder = StringUtils.hasValue(placeholderKnob)
        ? placeholderKnob
        : undefined;

    return (
        <EmailMultiInput
            emails={emails}
            label={label}
            onEmailsChanged={setEmails}
            placeholder={placeholder}
        />
    );
};
