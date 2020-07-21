import { useCallback, useEffect, useState } from "react";
import { Breakpoints } from "utilities/enumerations/breakpoints";
import { useWindow } from "andculturecode-javascript-react";

export enum BreakpointComparer {
    MinWidth = 0,
    MaxWith = 1,
}

/**
 * Uses the `useWindow` hook to return a boolean indicating
 * the screen width is at least that of provided `breakpoint`
 * @param breakpoint the breakpoint to use
 * @param comparer
 */
export default function useBreakpoint(
    breakpoint: Breakpoints,
    comparer: BreakpointComparer = BreakpointComparer.MinWidth
) {
    const { width } = useWindow();

    const compare = useCallback(
        (width: number) =>
            comparer === BreakpointComparer.MaxWith
                ? width <= breakpoint
                : width >= breakpoint,
        [comparer, breakpoint]
    );

    const [isInBreakpoint, setIsInBreakpoint] = useState(compare(width));

    useEffect(() => setIsInBreakpoint(compare(width)), [
        breakpoint,
        width,
        compare,
    ]);

    return isInBreakpoint;
}
