import EnvUtils from "utilities/env-utils";

export interface ScrollOptions extends ScrollIntoViewOptions {
    initialDelay?: number;
}

export const DefaultScrollOptions: ScrollOptions = {
    behavior: "auto",
    block: "start",
    inline: "nearest",
};

/**
 * Attempts to scroll to the element specified in the hash of the current path.
 * In the event of a slow page render, the element may not be immediately available.
 * This method will retry up to 50 times every 100ms to find the element before
 * giving up.
 *
 * Reference:
 * https://stackoverflow.com/a/54042987
 * https://stackoverflow.com/a/48195222
 */
const _scrollToHash = (
    location: any,
    options: ScrollOptions = DefaultScrollOptions
) => {
    if (location.hash == null || location.hash === "") {
        return;
    }

    const id = location.hash.replace("#", "");
    _scrollToElementById(id, options);
};

/**
 * Attempts to scroll to the element specified by the given ID.
 * In the event of a slow page render, the element may not be immediately available.
 * This method will retry up to 50 times every 100ms to find the element before
 * giving up.
 */
const _scrollToElementById = (
    id: string,
    options: ScrollOptions = DefaultScrollOptions
) => {
    let retryCount = 0;
    const tryToScroll = () => {
        retryCount += 1;

        if (retryCount > 50) {
            EnvUtils.runIfDevelopment(() =>
                console.warn(
                    `Could not find element with ID ${id} in the page.`
                )
            );

            // couldn't find element in 50 loops, give up.
            return;
        }

        const el = document.getElementById(id);
        if (el != null) {
            el.scrollIntoView(options);
            return;
        }

        setTimeout(tryToScroll, 100);
    };

    if (options.initialDelay != null) {
        setTimeout(tryToScroll, options.initialDelay);
        return;
    }

    tryToScroll();
};

/**
 * Attempts to scroll to the element specified by the given query selector.
 * In the event of a slow page render, the element may not be immediately available.
 * This method will retry up to 50 times every 100ms to find the element before
 * giving up.
 */
const _scrollToElementBySelector = (
    selector: string,
    options: ScrollOptions = DefaultScrollOptions
) => {
    let retryCount = 0;
    const tryToScroll = () => {
        retryCount += 1;

        if (retryCount > 50) {
            EnvUtils.runIfDevelopment(() =>
                console.warn(
                    `Could not find element matching selector ${selector} in the page.`
                )
            );

            // couldn't find element in 50 loops, give up.
            return;
        }

        const el = document.querySelector(selector);
        if (el != null) {
            el.scrollIntoView(options);
            return;
        }

        setTimeout(tryToScroll, 100);
    };

    if (options.initialDelay != null) {
        setTimeout(tryToScroll, options.initialDelay);
        return;
    }

    tryToScroll();
};

export const ScrollUtils = {
    scrollToHash: _scrollToHash,
    scrollToElementById: _scrollToElementById,
    scrollToElementBySelector: _scrollToElementBySelector,
};
