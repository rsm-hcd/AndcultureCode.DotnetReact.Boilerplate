import * as React from "react";
import { useEffect, useState, PropsWithChildren } from "react";
import {
    Button,
    ButtonStyles,
    Icon,
    Icons,
    IconSizes,
} from "andculturecode-javascript-react-components";
import { v4 } from "uuid";
import { CollectionUtils } from "andculturecode-javascript-core";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-collapse-panel";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface CollapsePanelProps {
    /**
     * Text to be rendered inside an "sr-only" class span for the collapse/expand button trigger,
     * typically the text that is the header of the panel.
     */
    buttonAriaText: string;
    collapse: boolean;
    panelTop: JSX.Element;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const CollapsePanel: React.FC<CollapsePanelProps> = (
    props: PropsWithChildren<CollapsePanelProps>
) => {
    const { buttonAriaText, children, collapse, panelTop } = props;
    const [isCollapsed, setCollapsed] = useState<boolean>(collapse);
    const hasChildren = CollectionUtils.hasValues(
        React.Children.toArray(children)
    );
    const accordionContentId = v4();
    const buttonId = v4();
    const cssIsExpanded = !isCollapsed && hasChildren ? "-expanded" : "";
    const toggleButtonStyle = isCollapsed
        ? ButtonStyles.Secondary
        : ButtonStyles.Tertiary;
    const toggleIcon = isCollapsed ? Icons.ChevronRight : Icons.ChevronDown;
    const toggleText = isCollapsed ? "Expand" : "Collapse";

    const handleToggle = () => {
        setCollapsed(!isCollapsed);
    };

    useEffect(() => {
        setCollapsed(collapse);
    }, [collapse]);

    return (
        <div className={`${COMPONENT_CLASS} ${cssIsExpanded}`}>
            {hasChildren && (
                <Button
                    accessibleText={toggleText}
                    ariaControls={accordionContentId}
                    ariaExpanded={!isCollapsed}
                    cssClassName="-icon"
                    id={buttonId}
                    onClick={handleToggle}
                    style={toggleButtonStyle}>
                    <Icon type={toggleIcon} size={IconSizes.Large} />
                    <span className={"sr-only"}>{buttonAriaText}</span>
                </Button>
            )}
            <div
                className={`${COMPONENT_CLASS}__heading`}
                onClick={handleToggle}>
                {panelTop}
            </div>
            <div
                aria-hidden={isCollapsed}
                aria-labelledby={buttonId}
                className={`${COMPONENT_CLASS}__content`}
                id={accordionContentId}
                role="region">
                <div className={`${COMPONENT_CLASS}__accordion`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

CollapsePanel.defaultProps = {
    collapse: true,
} as Partial<CollapsePanelProps>;

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default CollapsePanel;

// #endregion Exports
