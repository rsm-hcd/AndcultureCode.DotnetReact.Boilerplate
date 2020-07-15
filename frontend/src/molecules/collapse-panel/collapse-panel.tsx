import * as React from "react";
import { useEffect, useState } from "react";
import {
    Button,
    ButtonStyles,
    Icon,
    Icons,
    IconSizes,
} from "andculturecode-javascript-react-components";
import { v4 } from "uuid";
import { CollectionUtils } from "utilities/collection-utils";

export interface CollapsePanelProps {
    collapse: boolean;
    /**
     * Text to be rendered inside an "sr-only" class span for the collapse/expand button trigger,
     * typically the text that is the header of the panel.
     */
    buttonAriaText: string;
    panelTop: JSX.Element;
}

const CollapsePanel: React.FC<CollapsePanelProps> = ({
    panelTop,
    children,
    buttonAriaText,
    collapse,
}) => {
    const [isCollapsed, setCollapsed] = useState<boolean>(collapse);
    const cssBaseClass = "c-collapse-panel";
    const hasChildren = CollectionUtils.hasValues(
        React.Children.toArray(children)
    );
    const accordionContentId = v4();
    const buttonId = v4();

    const handleToggle = () => {
        setCollapsed(!isCollapsed);
    };

    useEffect(() => {
        setCollapsed(collapse);
    }, [collapse]);

    return (
        <div
            className={`${cssBaseClass} ${
                !isCollapsed && hasChildren ? "-expanded" : ""
            }`}>
            {hasChildren && (
                <Button
                    accessibleText={isCollapsed ? "Expand" : "Collapse"}
                    ariaControls={accordionContentId}
                    ariaExpanded={!isCollapsed}
                    cssClassName="-icon"
                    id={buttonId}
                    onClick={handleToggle}
                    style={
                        isCollapsed
                            ? ButtonStyles.Secondary
                            : ButtonStyles.Tertiary
                    }>
                    <Icon
                        type={
                            isCollapsed ? Icons.ChevronRight : Icons.ChevronDown
                        }
                        size={IconSizes.Large}
                    />
                    <span className={"sr-only"}>{buttonAriaText}</span>
                </Button>
            )}
            <div className={`${cssBaseClass}__heading`} onClick={handleToggle}>
                {panelTop}
            </div>
            <div
                aria-hidden={isCollapsed}
                aria-labelledby={buttonId}
                className={`${cssBaseClass}__content`}
                role="region"
                id={accordionContentId}>
                <div className={`${cssBaseClass}__accordion`}>{children}</div>
            </div>
        </div>
    );
};

CollapsePanel.defaultProps = {
    collapse: true,
} as Partial<CollapsePanelProps>;

export default CollapsePanel;
