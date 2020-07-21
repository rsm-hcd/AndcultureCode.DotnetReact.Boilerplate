import { boolean, object, text } from "@storybook/addon-knobs";
import ListBox, { ListBoxItem } from "molecules/lists/list-box";
import React from "react";
import { ToastContainer, ToastPosition, Zoom } from "react-toastify";
import { ToastManager } from "andculturecode-javascript-react-components";

export default {
    title: "Molecules | Lists / ListBox",
    component: ListBox,
};

const defaultItems: Array<ListBoxItem<number>> = [
    {
        id: 1,
        label: "Item 1",
        text: "This is the first item.",
    },
    {
        id: 2,
        label: "Item 2",
        text: "This is the second item.",
    },
    {
        id: 3,
        label: "Item 3",
        text: "This is the third item.",
    },
];

export const listBoxDefault = () => {
    const itemsKnob = object("ListBoxItems", defaultItems);
    const hideWhenNoItems = boolean("Hide When No Items", false);
    const hasAction = boolean("Has Action Button", true);
    const actionText = text("Action Button Text", "Click Me!");

    const handleActionClick = (id: number) =>
        ToastManager.success(`Clicked item ${id}!`);

    return (
        <React.Fragment>
            <ListBox
                items={itemsKnob}
                hideWhenNoItems={hideWhenNoItems}
                onActionClick={hasAction ? handleActionClick : undefined}
                actionText={actionText}
            />
            <ToastContainer
                draggable={false}
                position={ToastPosition.BOTTOM_RIGHT}
                autoClose={5000}
                closeOnClick={true}
                closeButton={false}
                transition={Zoom}
                toastClassName="c-toast"
            />
        </React.Fragment>
    );
};
