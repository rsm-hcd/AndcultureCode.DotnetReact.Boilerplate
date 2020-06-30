import { RefObject, useCallback, useEffect, useState } from "react";
import { useWindow } from "utilities/hooks/use-window";

/**
 * A custom hook for determining if elements overflow their containers.
 * Useful for when you have text-overflow: ellipsis; and you want to
 * detect whether the text is actually long enough to trigger the ellipsis
 * to appear.
 * @param ref
 */
export default function useTextOverflow<T extends HTMLElement>(
    ref: RefObject<T>
) {
    const getIsOverflowed = useCallback((): boolean => {
        if (ref.current == null) {
            return false;
        }

        return ref.current.offsetWidth < ref.current.scrollWidth;
    }, [ref]);

    const { width, height } = useWindow();
    const [isOverflowed, setIsOverflowed] = useState(getIsOverflowed());

    useEffect(() => setIsOverflowed(getIsOverflowed()), [
        getIsOverflowed,
        width,
        height,
    ]);

    return isOverflowed;
}
