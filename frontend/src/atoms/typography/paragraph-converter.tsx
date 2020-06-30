import { ParagraphSizes } from "atoms/constants/paragraph-sizes";
import Paragraph from "atoms/typography/paragraph";
import { XmlConvertedComponentProps } from "interfaces/forms/xml-converted-component-props";
import React from "react";

interface ParagraphConverterProps extends XmlConvertedComponentProps {}

const ParagraphConverter: React.FunctionComponent<ParagraphConverterProps> = (
    props: ParagraphConverterProps
) => {
    return <Paragraph size={ParagraphSizes.Base}>{props.children}</Paragraph>;
};

export default ParagraphConverter;
