import { XmlChangeNotationConstants } from "constants/xml-change-notation-constants";
import { XmlConvertedComponentProps } from "interfaces/forms/xml-converted-component-props";
import * as React from "react";

interface FractionProps extends XmlConvertedComponentProps {}

const Fraction: React.FunctionComponent<FractionProps> = (props) => {
    if (props.diffchanged === XmlChangeNotationConstants.DELETION) {
        return null;
    }

    const changedModifier =
        props.diffchanged != null ? ` c-code-change -${props.diffchanged}` : "";
    return (
        <span className={"c-fraction" + changedModifier}>{props.children}</span>
    );
};

export default Fraction;
