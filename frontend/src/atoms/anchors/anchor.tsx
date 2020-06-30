import { Link } from "react-router-dom";
import React, { forwardRef } from "react";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface AnchorProps {
    ariaLabel?: string;
    children?: any;
    cssClassName?: string;
    external?: boolean;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>, value?: any) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
    ref?: React.Ref<HTMLAnchorElement>;
    target?: string;
    title?: string;
    to: string;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const Anchor: React.RefForwardingComponent<Link, AnchorProps> = forwardRef(
    (props: AnchorProps, ref: React.Ref<HTMLAnchorElement>) => {
        let cssClassNames = [];

        if (props.cssClassName) {
            cssClassNames.push(props.cssClassName);
        }

        const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
            if (props.onClick != null) {
                props.onClick(e);
            }
        };

        let relAttribute: string | undefined = undefined;
        if (props.target != null) {
            // Using target="_blank" without rel="noopener noreferrer" is a security risk: see
            // https://mathiasbynens.github.io/rel-noopener  react/jsx-no-target-blank
            relAttribute = "noopener noreferrer";
        }

        const commonProps = {
            "aria-label": props.ariaLabel,
            className: cssClassNames.join(" "),
            id: props.id,
            onClick: onClickHandler,
            ref: ref,
            target: props.target,
            rel: relAttribute,
            title: props.title,
            onKeyDown: props.onKeyDown,
        };

        if (props.external === true) {
            return (
                <a href={props.to} {...commonProps}>
                    {props.children}
                </a>
            );
        }

        return (
            <Link to={props.to} {...commonProps}>
                {props.children}
            </Link>
        );
    }
);

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default Anchor;
