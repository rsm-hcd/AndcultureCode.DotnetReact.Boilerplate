import React from "react";
import { text } from "@storybook/addon-knobs";
import LinkCard from "./link-card";

export default {
    title: "Molecules | Cards / Link Cards",
    component: LinkCard,
};

export const linkCardDefault = () => (
    <LinkCard to="/" label="Link Card Label">
        {text("content", "Link Card Content")}
    </LinkCard>
);
