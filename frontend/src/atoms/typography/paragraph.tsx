import React, { forwardRef } from "react";
import { ParagraphSizes } from "atoms/constants/paragraph-sizes";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface ParagraphProps {
    children?: any;
    cssClassName?: string;
    dangerouslySetInnerHTML?: { __html: string };
    id?: string;
    ref?: React.RefObject<HTMLParagraphElement> | null;
    size?: ParagraphSizes;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const Paragraph: React.RefForwardingComponent<
    HTMLParagraphElement,
    ParagraphProps
> = forwardRef(
    (props: ParagraphProps, ref: React.Ref<HTMLParagraphElement>) => {
        let cssClassNames: Array<any> = [];

        if (props.cssClassName) {
            cssClassNames.push(props.cssClassName);
        }

        if (props.size) {
            cssClassNames.push(props.size);
        }

        return (
            <p
                className={cssClassNames.join(" ")}
                dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
                id={props.id}
                ref={ref}>
                {props.children}
            </p>
        );
    }
);

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default Paragraph;
