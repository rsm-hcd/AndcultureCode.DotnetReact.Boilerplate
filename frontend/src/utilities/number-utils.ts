import { Rfc4646LanguageCodes } from "andculturecode-javascript-core";

const defaultFormatter = new Intl.NumberFormat(Rfc4646LanguageCodes.EN_US);

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

const format = (
    num: number | Number,
    formatter: Intl.NumberFormat = defaultFormatter
): string => formatter.format(num as number);

/**
 * Attempts to parses an integer from the given input. If the input is already a number,
 * it returns that value. If the parsed value returns `NaN`, it returns `undefined`
 *
 * @param {(string | number)} [num]
 * @returns {(number | undefined)}
 */
const parseInt = (num?: string | number): number | undefined => {
    if (num == null) {
        return undefined;
    }

    if (typeof num === "number") {
        if (isNaN(num)) {
            return undefined;
        }

        return num;
    }

    const parsed = Number.parseInt(num);
    if (isNaN(parsed)) {
        return undefined;
    }

    return parsed;
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

const NumberUtils = {
    format,
    parseInt,
};

export default NumberUtils;

// #endregion Exports
