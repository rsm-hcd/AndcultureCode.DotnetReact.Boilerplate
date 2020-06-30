import * as React from "react";

import UnorderedList from "molecules/lists/unordered-list";

interface RadioListProps {
    items: JSX.Element[];
    style?: RadioListStyles;
}

export enum RadioListStyles {
    Default = "default",
    Button = "button",
}

const RadioList: React.FunctionComponent<RadioListProps> = (props) => {
    const { items, style } = props;
    const cssBaseClassName = "c-radio-list";

    if (items.length === 0) {
        return null;
    }

    const classNames = [cssBaseClassName];
    if (style === RadioListStyles.Button) {
        classNames.push("-button-style");
    }

    return (
        <fieldset className={classNames.join(" ")}>
            <UnorderedList listItems={items} />
        </fieldset>
    );
};

export default RadioList;
