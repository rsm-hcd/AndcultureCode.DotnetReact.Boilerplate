import React from "react";
import Paragraph from "./paragraph";
import Faker from "faker";
import { select } from "@storybook/addon-knobs";
import { ParagraphSizes } from "atoms/constants/paragraph-sizes";

export default {
    title: "Atoms | Typography / Paragraph",
    component: Paragraph,
};

export const paragraphDefault = () => (
    <Paragraph>{Faker.lorem.paragraph(10)}</Paragraph>
);

export const paragraphEmpty = () => <Paragraph></Paragraph>;

export const paragraphWithStyles = () => (
    <Paragraph cssClassName="-larger">{Faker.lorem.paragraph(4)}</Paragraph>
);

export const paragraphKnobs = () => (
    <Paragraph size={select("size", ParagraphSizes, ParagraphSizes.Base)}>
        {Faker.lorem.paragraph(10)}
    </Paragraph>
);
