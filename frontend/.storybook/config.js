import { configure, addParameters, addDecorator } from "@storybook/react";
import { setDefaults } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";
import "assets/scss/app.scss";
import "./storybook.css";

setDefaults({
    header: true,
    inline: true,
    source: true,
});

addParameters({
    options: {
        panelPosition: "right", // 'Bottom' is the other option.
    },
});

addDecorator(withInfo);
addDecorator(withKnobs({ escapeHTML: false }));

// automatically import all files ending in *.stories.js
configure(require.context("../src", true, /\.stories\.tsx$/), module);
