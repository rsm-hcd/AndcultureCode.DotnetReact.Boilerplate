import { boolean, number } from "@storybook/addon-knobs";
import FileUploadProgressBar from "molecules/progress-bars/file-upload-progress-bar";
import React from "react";

export default {
    title: "Molecules | Progress Bars / File Upload Progress Bar",
    component: FileUploadProgressBar,
};

export const fileUploadProgressBarKnobs = () => (
    <FileUploadProgressBar
        value={number("Progress Percent", 50, {
            step: 1,
            min: 0,
            max: 100,
        })}
        isErrored={boolean("Is Errored", false)}
    />
);
