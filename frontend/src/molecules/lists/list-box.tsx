import {
    Button,
    ButtonSizes,
    ButtonStyles,
    ButtonTypes,
} from "andculturecode-javascript-react-components";
import { Paragraph } from "andculturecode-javascript-react-components";
import React, { ReactElement } from "react";
import { CollectionUtils } from "andculturecode-javascript-core";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

export const ListBoxBaseClassName = "c-list-box";
export const ListBoxItemClassName = `${ListBoxBaseClassName}__item`;

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface ListBoxItem<T> {
    customAction?: React.ReactNode | React.ReactNodeArray;
    id: T;
    label?: string;
    text: string | React.ReactNode | React.ReactNodeArray;
}

export interface ListBoxProps<T> {
    actionText?: string;
    children?: React.ReactNode | React.ReactNodeArray;
    hideWhenNoItems?: boolean;
    items?: Array<ListBoxItem<T>>;
    onActionClick?: (id: T) => void;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const ListBox = <T extends any>(
    props: ListBoxProps<T>
): ReactElement<ListBoxProps<T>> | null => {
    if (props.items != null && CollectionUtils.isEmpty(props.items)) {
        if (props.hideWhenNoItems === true) {
            return null;
        }

        return (
            <div className={`${ListBoxBaseClassName} -empty`}>
                <Paragraph>No Items Added</Paragraph>
            </div>
        );
    }

    return (
        <div className={ListBoxBaseClassName}>
            {CollectionUtils.hasValues(props.items) &&
                props.items!.map((item: ListBoxItem<T>) => (
                    <div className={ListBoxItemClassName} key={item.id}>
                        {// if
                        item.label != null && (
                            <div className={`${ListBoxItemClassName}__label`}>
                                {item.label}
                            </div>
                        )}
                        <div className={`${ListBoxItemClassName}__text`}>
                            {item.text}
                        </div>
                        {// if
                        props.onActionClick != null && (
                            <Button
                                type={ButtonTypes.Button}
                                cssClassName={`${ListBoxItemClassName}__action`}
                                onClick={() => props.onActionClick!(item.id)}
                                size={ButtonSizes.Small}
                                style={ButtonStyles.TertiaryAlt}>
                                {props.actionText ?? "Action"}
                            </Button>
                        )}
                        {item.customAction}
                    </div>
                ))}
            {props.children}
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default ListBox;

// #endregion Exports
