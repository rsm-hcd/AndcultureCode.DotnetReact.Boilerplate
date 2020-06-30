import Faker from "faker";
import Form from "molecules/forms/form";
import React from "react";
import SubmitButton from "atoms/forms/submit-button";
import { text } from "@storybook/addon-knobs";

export default {
    title: "Molecules | Forms / Form",
    component: Form,
};

export const formDefault = () => (
    <Form onSubmit={() => alert("form submitted")}>
        <div className="c-form-field">
            <label>
                {Faker.hacker.noun()}
                <input type="text"></input>
            </label>
        </div>

        <SubmitButton />
    </Form>
);

export const formKnobs = () => (
    <Form
        cssClassName={text("cssClassName", "c-form")}
        onSubmit={() => alert("Form Submitted")}
        buttonText={text("buttonText", "Submit")}>
        <div className="c-form-field">
            <label>
                {Faker.hacker.noun()}
                <input type="text" />
            </label>
        </div>

        <SubmitButton />
    </Form>
);
