// import { Icons } from "atoms/constants/icons";
import { Icon, Icons } from "andculturecode-javascript-react-components";
import React, { ChangeEvent } from "react";
import StringUtils from "utilities/string-utils";

/*
-----------------------------------------------------------------------------------------
Interfaces
-----------------------------------------------------------------------------------------
*/

export interface SelectProps<T = any> {
    cssClassName?: string;
    id: string;
    onChange: (selectedOption?: SelectOption<T>) => void;
    name?: string;
    options: SelectOption<T>[];
    value?: string;
}

export interface SelectOption<T = any> {
    data?: T;
    label: string;
    value: string;
}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const Select: React.FC<SelectProps> = (props: SelectProps) => {
    const classNames = ["c-select"];
    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    const selectOptions = props.options.map((option) => {
        return (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        );
    });

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const option = props.options.find(
            (o: SelectOption) => o.value === e.target.value
        );
        props.onChange(option);
    };

    return (
        <div className={classNames.join(" ")}>
            <select
                onChange={handleChange}
                value={props.value}
                name={props.name}>
                {selectOptions}
            </select>
            <Icon type={Icons.ChevronDown} />
        </div>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default Select;
