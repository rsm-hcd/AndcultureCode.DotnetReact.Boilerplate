import { KeyboardConstants } from "constants/keyboard-constants";
import * as React from "react";
import { useEffect } from "react";

interface AccessibleListProps {
    focusFirstItem: boolean;
    onEsc?: () => void;
}

/**
 * Applies accessible keyboard functionality to a list of elements. For example, arrow key movement
 * between items.
 */
const AccessibleList: React.FunctionComponent<AccessibleListProps> = (
    props: React.PropsWithChildren<AccessibleListProps>
) => {
    const [current, setCurrent] = React.useState<number>(0);
    const refArray: HTMLElement[] = [];

    useEffect(() => {
        const element = refArray[current];
        if (element == null || !props.focusFirstItem) {
            return;
        }

        element.focus();
    }, [refArray, current, props.focusFirstItem]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (
            e.key === KeyboardConstants.DownArrow &&
            current === refArray.length - 1
        ) {
            e.preventDefault();
            setCurrent(0);
            return;
        }

        if (e.key === KeyboardConstants.UpArrow && current === 0) {
            e.preventDefault();
            setCurrent(refArray.length - 1);
            return;
        }

        if (
            e.key === KeyboardConstants.DownArrow &&
            current !== refArray.length - 1
        ) {
            e.preventDefault();

            setCurrent(current + 1);
            return;
        }

        if (e.key === KeyboardConstants.UpArrow && current !== 0) {
            e.preventDefault();

            setCurrent(current - 1);
            return;
        }

        if (e.key === KeyboardConstants.Escape) {
            e.preventDefault();
            setCurrent(0);

            if (props.onEsc != null) {
                props.onEsc();
            }
            return;
        }
    };

    const renderChildren = () => {
        let validElementIndex = 0;
        return React.Children.map(props.children, (child: React.ReactNode) => {
            if (!React.isValidElement(child)) {
                return child;
            }

            return React.cloneElement(child, {
                ...child.props,
                onClick: () => {
                    if (child.props.onClick != null) {
                        child.props.onClick();
                    }
                },
                onKeyDown: handleKeyDown,
                ref: (el: HTMLElement) => (refArray[validElementIndex++] = el),
            });
        });
    };

    return <React.Fragment>{renderChildren()}</React.Fragment>;
};

export default AccessibleList;
