import React from "react";
import { HeadingPriority } from "atoms/constants/heading-priority";
import Heading from "./heading";
import Icon from "atoms/icons/icon";
import { Icons } from "atoms/constants/icons";
import { IconSizes } from "atoms/constants/icon-sizes";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface HeadingIconProps {
    children?: any;
    iconSize?: IconSizes;
    priority?: HeadingPriority;
    type: keyof typeof Icons;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const HeadingIcon: React.FC<HeadingIconProps> = (props: HeadingIconProps) => {
    return (
        <div className="c-heading-icon">
            <Icon type={props.type} size={props.iconSize} />
            <Heading priority={props.priority}>{props.children}</Heading>
        </div>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default HeadingIcon;
