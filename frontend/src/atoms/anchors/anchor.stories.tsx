import React from "react";
import Anchor from "./anchor";
import Faker from "faker";
import { addDecorator } from "@storybook/react";
import StoryRouter from "storybook-react-router";

addDecorator(StoryRouter());

export default {
    title: "Atoms | Anchors / Anchor",
    component: Anchor,
};

export const anchorDefault = () => (
    <Anchor to="/test">{Faker.lorem.words(5)}</Anchor>
);
