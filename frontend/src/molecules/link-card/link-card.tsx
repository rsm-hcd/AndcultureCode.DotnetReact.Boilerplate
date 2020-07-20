import React, { ReactNode } from "react";
import { LinkCardTypes } from "molecules/constants/link-card-types";
import StringUtils from "utilities/string-utils";
import {
    Anchor,
    Button,
    Icon,
    Icons,
    Paragraph,
    ParagraphSizes,
} from "andculturecode-javascript-react-components";

// -------------------------------------------------------------------------------------------------
// #region Contants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-link-card";

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface LinkCardProps {
    children: any;
    includeIcon?: boolean;
    label: string;
    to?: any;
    type?: LinkCardTypes;
    onClick?: () => void;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const LinkCard: React.FC<LinkCardProps> = (props: LinkCardProps) => {
    const cssClassNames = [COMPONENT_CLASS];
    if (props.includeIcon) {
        cssClassNames.push("-with-icon");
    }
    const cssClassNamesFlat = cssClassNames.join(" ");

    const renderChildren = () => (
        <React.Fragment>
            {// if
            props.includeIcon && <Icon type={Icons.Lightbulb} />}
            <div className={`${COMPONENT_CLASS}__content`}>
                <Paragraph size={ParagraphSizes.Small}>
                    {props.children}
                </Paragraph>
                {// if
                StringUtils.hasValue(props.label) && (
                    <div className={`${COMPONENT_CLASS}__label`}>
                        <Paragraph size={ParagraphSizes.XSmall}>
                            {props.label}
                        </Paragraph>
                    </div>
                )}
            </div>
        </React.Fragment>
    );

    return (
        <div>
            {// if
            props.type === LinkCardTypes.Button && (
                <Button
                    cssClassName={cssClassNamesFlat}
                    onClick={props.onClick}>
                    {renderChildren()}
                </Button>
            )}
            {// if
            props.type === LinkCardTypes.Link && (
                <Anchor cssClassName={cssClassNamesFlat} to={props.to}>
                    {renderChildren()}
                </Anchor>
            )}
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default LinkCard;

// #endregion Exports
