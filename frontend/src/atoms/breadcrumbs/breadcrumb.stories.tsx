import Breadcrumb from "atoms/breadcrumbs/breadcrumb";
import React from "react";
import StoryRouter from "storybook-react-router";
import { addDecorator } from "@storybook/react";

addDecorator(StoryRouter());

export default {
    title: "Atoms | Breadcrumb",
    component: Breadcrumb,
};

/// Note: This component needs to be refactored to better represent what the component does.
/// The component is currently wrapped in a Link component because of the HOC

export const breadcrumb = () => (
    <a href="/" className={`c-breadcrumb`}>
        <Breadcrumb>
            <span>Link in a Chain</span>
        </Breadcrumb>
    </a>
);
