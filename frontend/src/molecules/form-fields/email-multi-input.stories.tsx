import { text } from "@storybook/addon-knobs";
import EmailMultiInput from "molecules/form-fields/email-multi-input";
import React, { useState } from "react";
import StringUtils from "utilities/string-utils";

export default {
    title: "Molecules | Forms / Email Multi Input Form Field",
    component: EmailMultiInput,
};

export const EmailMultiInputDefault = () => {
    const [emails, setEmails] = useState<Array<string>>([]);

    const labelKnob = text("Label", "");
    const placeholderKnob = text("Placeholder", "");

    return (
        <EmailMultiInput
            emails={emails}
            onEmailsChanged={setEmails}
            label={StringUtils.hasValue(labelKnob) ? labelKnob : undefined}
            placeholder={
                StringUtils.hasValue(placeholderKnob)
                    ? placeholderKnob
                    : undefined
            }
        />
    );
};
