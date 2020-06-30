import React from "react";
import { text } from "@storybook/addon-knobs";
import ErrorBanner from "molecules/errors/error-banner";

export default {
    title: "Molecules | Errors / Error Banner",
    component: ErrorBanner,
};

export const errorBannerDefault = () => (
    <ErrorBanner text={text("Text", "This is an error message.")} />
);
