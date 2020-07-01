import React, { useEffect, useState } from "react";

/**
 * Custom hook providing utility to take some action when a mouse event is fired outside of an element.
 * @param ref
 * @param handler
 * @param deps
 */
export default function useOnClickOutside(
    ref: React.RefObject<HTMLElement>,
    handler: () => void,
    deps?: React.DependencyList | undefined
) {
    // Ensure we only attach one event
    const [hasEvent, setHasEvent] = useState<boolean>(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref != null &&
                ref.current != null &&
                !ref.current.contains(event.target as Node)
            ) {
                handler();
                return;
            }
            return true;
        };
        const layout = document.getElementById("root");

        if (!hasEvent && layout != null) {
            const event = (e: MouseEvent) => {
                handleClickOutside(e);
                layout.removeEventListener("mousedown", event);
                setHasEvent(false);
            };

            layout.addEventListener("mousedown", event);
            setHasEvent(true);
            return;
        }
    }, [ref, handler, deps, hasEvent]);
}
