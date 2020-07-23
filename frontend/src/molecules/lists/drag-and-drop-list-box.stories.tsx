import { Paragraph } from "andculturecode-javascript-react-components";
import DragAndDropListBox from "molecules/lists/drag-and-drop-list-box";
import { ListBoxItem } from "molecules/lists/list-box";
import React, { useState } from "react";

export default {
    title: "Molecules | Lists / DragAndDropListBox",
    component: DragAndDropListBox,
};

export const DragAndDropListBoxDefault = () => {
    const [items, setItems] = useState<Array<ListBoxItem<number>>>([
        {
            id: 0,
            label: "0",
            text: "Item Number 0",
        },
        {
            id: 1,
            label: "1",
            text: "Item Number 1",
        },
        {
            id: 2,
            label: "2",
            text: "Item Number 2",
        },
        {
            id: 3,
            label: "3",
            text: "Item Number 3",
        },
    ]);

    const onReordered = (startIndex: number, endIndex: number) => {
        const result = [...items];
        const [removedItem] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removedItem);

        setItems(result);
    };

    return (
        <React.Fragment>
            <Paragraph>Drag and drop items to reorder them.</Paragraph>
            <DragAndDropListBox
                droppableId="drag-and-drop-list-box.tsx"
                items={items}
                onReordered={onReordered}
            />
        </React.Fragment>
    );
};
