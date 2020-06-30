import React from "react";

export interface PercentCoordinates {
    percentageX: number;
    percentageY: number;
}

const getRelativeClickCoordinates = (
    e: React.MouseEvent,
    droppedItemSize: number = 0
): PercentCoordinates => {
    const position = {
        x: e!.pageX,
        y: e!.pageY,
    };
    const targetElement = e?.currentTarget;

    let dropY =
        position.y -
        targetElement!.getBoundingClientRect().top -
        droppedItemSize / 2;
    if (dropY < 0) {
        dropY = 0;
    }
    const percentageY = dropY / targetElement!.getBoundingClientRect().height;
    let dropX =
        position.x -
        targetElement!.getBoundingClientRect().left -
        droppedItemSize / 2;
    if (dropX < 0) {
        dropX = 0;
    }
    const percentageX = dropX / targetElement!.getBoundingClientRect().width;

    return { percentageX, percentageY };
};

const EventUtils = {
    getRelativeClickCoordinates,
};

export default EventUtils;
