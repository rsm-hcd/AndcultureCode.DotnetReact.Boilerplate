import { List } from "immutable";
import { CollectionUtils } from "andculturecode-javascript-core";

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

const capitalize = (s: string) => {
    if (isEmpty(s)) {
        return s;
    }

    if (s.length === 1) {
        return s.toUpperCase();
    }

    return `${s[0].toUpperCase()}${s.substr(1).toLowerCase()}`;
};

/**
 * Generates an 'excerpt' based around a provided substring to ensure it is always present in the
 * output string, and the output string is less than or equal to the specified character limit.
 *
 * @param {string} fullString
 * @param {string} substring
 * @param {number} characterLimit
 * @returns {string}
 */
const generateExcerpt = (
    fullString: string,
    substring: string,
    characterLimit: number
): string => {
    // Subtract 6 from the character limit to account for ellipses before & after
    characterLimit = characterLimit - 6;
    const getCharCount = (list: List<string>): number =>
        list.filter((value: string) => value != null).join(" ").length;

    const originalWords = List(
        fullString.split(" ").filter((e: string) => e.trim() !== "")
    );

    const indexOfSubstring = originalWords.indexOf(substring);

    // If the substring cannot be found, return the original string
    if (indexOfSubstring < 0) {
        return fullString;
    }

    let truncatedList = List([substring]);
    let offsetFromSubstring = 1;
    let canContinue = true;

    // Loop over the original list of words, fanning out from the first instance of the substring
    // until we have hit the character limit or we have no more words to pull from in both directions.
    while (canContinue && getCharCount(truncatedList) <= characterLimit) {
        // Determine whether we should continue based on whether the offset value from the substring
        // is within the range of the original word list count
        const indexOfNextWord = indexOfSubstring + offsetFromSubstring;
        const indexOfPreviousWord = indexOfSubstring - offsetFromSubstring;

        // Attempt to grab the next word in the original input string. If the index is invalid,
        // we'll null check the result before pushing it to our rebuilt list.
        const nextWord = originalWords.get(indexOfNextWord);

        // Make sure the calculated previous word index is not negative. A negative index is valid
        // and will start pulling values from the back of the collection which is desired behavior
        // for rebuilding the provided sentence/paragraph text in order.
        const prevWord =
            indexOfPreviousWord >= 0
                ? originalWords.get(indexOfSubstring - offsetFromSubstring)
                : null;

        // If we don't have a word on either side, we cannot continue building out the truncated list
        // of words.
        canContinue = nextWord != null || prevWord != null;

        if (!canContinue) {
            break;
        }

        let expandedWordList = List<string>();
        if (prevWord != null) {
            expandedWordList = expandedWordList.push(prevWord);
        }

        expandedWordList = expandedWordList.concat(truncatedList);

        if (nextWord != null) {
            expandedWordList = expandedWordList.push(nextWord);
        }

        if (getCharCount(expandedWordList) > characterLimit) {
            canContinue = false;
            break;
        }

        // Increment the offset to 'fan out' another word on each side for the next iteration
        offsetFromSubstring++;
        truncatedList = expandedWordList;
    }

    // Add ellipses before and after if the first and last elements of the array are do not match
    // the original array of words we are working from.
    let excerpt = truncatedList.join(" ");
    if (truncatedList.first() !== originalWords.first()) {
        excerpt = `...${excerpt}`;
    }

    if (truncatedList.last() !== originalWords.last()) {
        excerpt = `${excerpt}...`;
    }

    return excerpt;
};

/**
 * Determines whether or not the provided value is NOT `undefined`, `null`, or an empty string
 * (after trimming both ends of the string)
 *
 * @param {string} [value]
 * @returns {boolean}
 */
const hasValue = (value?: string): boolean =>
    // toString is called here to ensure handling all edge cases when a non string value is passed in this fuction
    value != null && value.toString().trim() !== "";

/**
 * Determines whether or not the provided value is `undefined`, `null`, or an empty string
 * (after trimming both ends of the string)
 *
 * @param {string} [value]
 * @returns {boolean}
 */
const isEmpty = (value?: string): boolean =>
    // toString is called here to ensure handling all edge cases when a non string value is passed in this fuction
    value == null || value.toString().trim() === "";

/**
 * Validates a given string matches a valid email format
 * @param value
 */
const isValidEmail = (value?: string): boolean =>
    value != null &&
    new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(value);

/**
 * Validates a string matches a vaild US phone number
 * @param value
 */
const isValidPhoneNumber = (value?: string): boolean =>
    value != null && new RegExp(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/).test(value);
/**
 * Validates a given string is at least 6 characters long and meets 3 of the following:
 * 1 uppercase letter
 * 1 lowercase leter
 * 1 number
 * 1 special character
 * @param value
 */
const isValidPassword = (value?: string): boolean =>
    value != null &&
    new RegExp(
        /(?=.{6,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])).*/
    ).test(value);

/**
 * Joins an array of strings into one string with a separator. If the array is empty, it will return an empty string.
 *
 * @default ""
 * @param {string[]} values Values to join into one string.
 * @param {string} [separator=","] String to seperate each of the given values.
 * @returns {string}
 */
const join = (values: string[], separator: string = ","): string => {
    if (CollectionUtils.isEmpty(values)) {
        return "";
    }

    return values.join(separator);
};

/**
 * Joins an array of strings representing css class names into one string, each separated by a space.
 * If the array is empty, it will return an empty string.
 *
 * @default ""
 * @param {string[]} classNames
 * @returns {string}
 */
const joinClassNames = (classNames: string[]): string => join(classNames, " ");

const truncateRight = (value: string, truncateAtPos: number): string => {
    if (value.length <= truncateAtPos) {
        return value;
    }

    const truncatedValue = value.substring(0, truncateAtPos - 3).trim();

    return truncatedValue.endsWith(".")
        ? truncatedValue
        : `${truncatedValue}...`;
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

const StringUtils = {
    capitalize,
    generateExcerpt,
    hasValue,
    isEmpty,
    isValidEmail,
    isValidPassword,
    isValidPhoneNumber,
    join,
    joinClassNames,
    truncateRight,
};

export default StringUtils;

// #endregion Exports
