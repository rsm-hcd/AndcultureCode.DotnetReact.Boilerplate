import { ParagraphSizes } from "atoms/constants/paragraph-sizes";
import Paragraph from "atoms/typography/paragraph";
import React from "react";
import { LinkCardTypes } from "molecules/constants/link-card-types";
import StringUtils from "utilities/string-utils";
import {
    Anchor,
    Button,
    Icon,
    Icons,
} from "andculturecode-javascript-react-components";

export interface LinkCardProps {
    children: any;
    includeIcon?: boolean;
    label: string;
    to?: any;
    type?: LinkCardTypes;
    onClick?: () => void;
}

const LinkCard: React.FC<LinkCardProps> = (props: LinkCardProps) => {
    const CSS_BASE_CLASS_NAME = "c-link-card";
    const cssClassNames = [CSS_BASE_CLASS_NAME];
    if (props.includeIcon) {
        cssClassNames.push("-with-icon");
    }
    return (
        <div>
            {// if
            props.type === LinkCardTypes.Button && (
                <Button
                    onClick={props.onClick}
                    cssClassName={cssClassNames.join(" ")}>
                    {// if - TODO: Switch to Lightbulb when AndcultureCode component gets it
                    props.includeIcon && <Icon type={Icons.Checkmark} />}
                    <div className={`${CSS_BASE_CLASS_NAME}__content`}>
                        <Paragraph size={ParagraphSizes.Small}>
                            {props.children}
                        </Paragraph>
                        {// if
                        StringUtils.hasValue(props.label) && (
                            <div className={`${CSS_BASE_CLASS_NAME}__label`}>
                                <Paragraph size={ParagraphSizes.XSmall}>
                                    {props.label}
                                </Paragraph>
                            </div>
                        )}
                    </div>
                </Button>
            )}
            {// if
            props.type === LinkCardTypes.Link && (
                <Anchor to={props.to} cssClassName={cssClassNames.join(" ")}>
                    {// if - TODO: Switch to Lightbulb when AndcultureCode component gets it
                    props.includeIcon && <Icon type={Icons.Checkmark} />}
                    <div className={`${CSS_BASE_CLASS_NAME}__content`}>
                        <Paragraph size={ParagraphSizes.Small}>
                            {props.children}
                        </Paragraph>
                        {// if
                        StringUtils.hasValue(props.label) && (
                            <div className={`${CSS_BASE_CLASS_NAME}__label`}>
                                <Paragraph size={ParagraphSizes.XSmall}>
                                    {props.label}
                                </Paragraph>
                            </div>
                        )}
                    </div>
                </Anchor>
            )}
        </div>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default LinkCard;
