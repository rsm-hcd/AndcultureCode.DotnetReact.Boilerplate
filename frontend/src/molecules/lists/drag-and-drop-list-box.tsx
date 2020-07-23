import {
    Button,
    ButtonTypes,
    ButtonSizes,
    ButtonStyles,
    Icon,
    Icons,
    IconSizes,
    Paragraph,
} from "andculturecode-javascript-react-components";
import {
    ListBoxBaseClassName,
    ListBoxItem,
    ListBoxItemClassName,
    ListBoxProps,
} from "molecules/lists/list-box";
import React, { ReactElement } from "react";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    DropResult,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { CollectionUtils } from "andculturecode-javascript-core";
import uuid from "uuid";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = `${ListBoxBaseClassName} c-drag-and-drop-list-box`;

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface DragAndDropListBoxProps<T>
    extends Omit<ListBoxProps<T>, "children" | "items"> {
    droppableId: string;
    items: Array<ListBoxItem<T>>;
    onReordered: (startIndex: number, endIndex: number) => void;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const DragAndDropListBox = <T extends any>(
    props: DragAndDropListBoxProps<T>
): ReactElement<ListBoxProps<T>> | null => {
    const items = props.items;
    const hasItems = CollectionUtils.hasValues(items);

    // Short-circuit if no items in collection
    if (items != null && !hasItems) {
        if (props.hideWhenNoItems) {
            return null;
        }

        return (
            <div className={`${COMPONENT_CLASS} -empty`}>
                <Paragraph>No Items Added</Paragraph>
            </div>
        );
    }

    const handleDragEnd = (result: DropResult) => {
        if (
            result?.destination == null ||
            result?.source == null ||
            result.source.index === result.destination.index
        ) {
            return;
        }

        props.onReordered(result.source.index, result.destination!.index);
    };

    /**
     * if we don't memoize the child rendering, then the <Draggable> state
     * sometimes does not update properly. Without memoization, if you drag
     * and drop a <Draggable> outside it's <Droppable>, then the <Draggable> will
     * still think it's being dragged, and apply the -dragging class, even though
     * it is no longer being dragged. Memoization of rendering the list fixes
     * this issue, and also increases performance.
     */
    const DraggableItemList = React.memo(function<T extends any>(itemProps: {
        items: Array<ListBoxItem<T>>;
    }) {
        const cssIsDragging = (snapshot: DraggableStateSnapshot) =>
            snapshot.isDragging ? "-dragging" : "";

        return (
            <React.Fragment>
                {itemProps.items.map((item: ListBoxItem<T>, index: number) => (
                    <Draggable
                        draggableId={item.id.toString()}
                        index={index}
                        key={uuid.v4()}>
                        {(
                            provided: DraggableProvided,
                            snapshot: DraggableStateSnapshot
                        ) => (
                            <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={`${ListBoxItemClassName} ${cssIsDragging(
                                    snapshot
                                )}`}
                                style={provided.draggableProps.style}>
                                <div className="-drag-handle">
                                    <Icon
                                        type={Icons.DragAndDrop}
                                        size={IconSizes.Large}
                                    />
                                </div>
                                {// if
                                item.label != null && (
                                    <div
                                        className={`${ListBoxItemClassName}__label`}>
                                        {item.label}
                                    </div>
                                )}
                                <div
                                    className={`${ListBoxItemClassName}__text`}>
                                    {item.text}
                                </div>
                                {// if
                                props.onActionClick != null && (
                                    <Button
                                        type={ButtonTypes.Button}
                                        cssClassName={`${ListBoxItemClassName}__action`}
                                        onClick={() =>
                                            props.onActionClick!(
                                                // @ts-ignore it's complaining that T could be a subclass of T
                                                item.id
                                            )
                                        }
                                        size={ButtonSizes.Small}
                                        style={ButtonStyles.TertiaryAlt}>
                                        {props.actionText ?? "Action"}
                                    </Button>
                                )}
                                {item.customAction}
                            </div>
                        )}
                    </Draggable>
                ))}
            </React.Fragment>
        );
    });

    const cssIsDragging = (snapshot: DroppableStateSnapshot) =>
        snapshot.isDraggingOver ? "-dragging-container" : "";

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={props.droppableId}>
                {(
                    provided: DroppableProvided,
                    snapshot: DroppableStateSnapshot
                ) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`${COMPONENT_CLASS} ${cssIsDragging(
                            snapshot
                        )}`}>
                        {// if
                        hasItems && <DraggableItemList items={items} />}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default DragAndDropListBox;

// #endregion Exports
