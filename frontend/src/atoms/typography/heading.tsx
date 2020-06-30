import React from "react";
import { HeadingPriority } from "atoms/constants/heading-priority";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface HeadingProps {
    children?: any;
    cssClassName?: string;
    id?: string;
    priority?: HeadingPriority;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const Heading: React.FC<HeadingProps> = (props: HeadingProps) => {
    let cssClassNames: Array<any> = [];

    if (props.cssClassName) {
        cssClassNames.push(props.cssClassName);
    }

    let componentProps = {
        className: cssClassNames.join(" "),
    };

    return React.createElement(
        `h${props.priority || HeadingPriority.Two}`,
        componentProps,
        props.children
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default Heading;
