import { useEffect, useState } from "react";
import { WindowEvents } from "utilities/enumerations/window-events";

/**
 * Custom hook to get window properties.
 * Hook into window events and make properties more easily accessible to components.
 *
 */
export function useWindow() {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener(WindowEvents.Resize, handleWindowResize);
        return () =>
            window.removeEventListener(WindowEvents.Resize, handleWindowResize);
    }, []);

    return { width, height };
}
