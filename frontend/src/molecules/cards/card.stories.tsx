import Card from "./card";
import React from "react";
import { text } from "@storybook/addon-knobs";

export default {
    title: "Molecules | Cards / Cards",
    component: Card,
};

export const cardDefault = () => (
    <Card label="Card Label">{text("content", "Card Content")}</Card>
);
