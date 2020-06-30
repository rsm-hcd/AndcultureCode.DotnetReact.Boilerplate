import * as React from "react";

import { SvgIcon, SvgIcons } from "atoms/constants/svg-icons";

import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface IconProps {
    cssClassName?: string;
    size?: IconSizes;
    type: keyof typeof Icons;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const Icon: React.FunctionComponent<IconProps> = (props: IconProps) => {
    let cssClassNames: Array<any> = [];

    cssClassNames.push("c-icon");
    if (props.cssClassName) {
        cssClassNames.push(props.cssClassName);
    }

    if (props.size) {
        cssClassNames.push(props.size);
    }

    const icon: SvgIcon = SvgIcons.find(
        (x: SvgIcon) => x.key === props.type
    ) as SvgIcon;

    if (icon === null || icon === undefined) {
        return <i></i>;
    }

    if (props.size === IconSizes.Large) {
        return React.createElement(icon.large, {
            className: cssClassNames.join(" "),
        });
    }

    return React.createElement(icon.base, {
        className: cssClassNames.join(" "),
    });
};

// #endregion Component
export default Icon;
