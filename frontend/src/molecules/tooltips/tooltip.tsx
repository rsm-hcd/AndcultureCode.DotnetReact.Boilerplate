import Tippy from "@tippyjs/react";
import { followCursor } from "tippy.js";
import React from "react";
import StringUtils from "utilities/string-utils";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface TooltipProps {
    /**
     * Required. The element that triggers the tooltip on hovering.
     * Surround the trigger with the `<Tooltip>` component.
     */
    children: React.ReactElement;
    /**
     * The content of the tooltip itself.
     */
    content: React.ReactChild | React.ReactChild[];
    cssClassName?: string;
    /**
     * Delay to wait before showing tooltip, in ms. Defaults to 500.
     */
    delay?: number;
    /**
     * Disable the tooltip. For example, if you have overflowing text,
     * and you only want to show if the text is actually truncated with ...
     * you can get a ref to the HTML element and set
     * disabled={elRef.offsetWidth < elRef.scrollWidth}
     * @see resource-subtext-label.tsx for an example of how to achieve this behavior
     */
    disabled?: boolean;
    /**
     * True by default. If true, the tooltip will appear at the cursor's location.
     */
    showOnCursor?: boolean;
    /**
     * Manually control tooltip visibility.
     * Useful for debugging styles.
     */
    visible?: boolean;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const Tooltip: React.FC<TooltipProps> = (props: TooltipProps) => {
    const CSS_CLASS_NAME = "c-tooltip";
    const classNames = [CSS_CLASS_NAME];

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    const getContent = () => (
        <React.Fragment>
            {props.content}
            <div className={`${CSS_CLASS_NAME}__arrow`} />
        </React.Fragment>
    );

    if (props.disabled === true) {
        return props.children;
    }

    return (
        <Tippy
            className={classNames.join(" ")}
            content={getContent()}
            delay={props.delay ?? 500}
            followCursor={props.showOnCursor === false ? undefined : "initial"}
            hideOnClick={false}
            plugins={[followCursor]}
            visible={props.visible}>
            {props.children}
        </Tippy>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default Tooltip;

// #endregion Exports
