import React from "react";
import Faker from "faker";
import { select } from "@storybook/addon-knobs";
import { HeadingPriority } from "atoms/constants/heading-priority";
import Heading from "./heading";
import { TestUtils } from "utilities/test-utils";

export default {
    title: "Atoms | Typography / Heading",
    component: Heading,
};

export const headingDefault = () => <Heading>{Faker.lorem.text()}</Heading>;

export const headingKnobs = () => {
    const options = TestUtils.numericEnumToPojo(HeadingPriority);

    return (
        <Heading
            priority={
                select(
                    "priority",
                    options,
                    HeadingPriority.One
                ) as HeadingPriority
            }>
            Voluptas Expedita Magnam
        </Heading>
    );
};
