import { CoreUtils } from "utilities/core-utils";
import faker from "faker";

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

/**
 * Transforms an enum into an array of its values
 *
 * @example
 * const roleTypes = TestUtils.enumToArray<RoleType>(RoleType);
 * // Returns [0, 1, 2, 3, 4, 5]
 * @template TEnum The enum to be transformed
 * @param {*} enumObject The enum to be transformed (cannot be typed to TEnum, or TS will return 'typeof TEnum'
 * instead of a value of TEnum)
 * @returns {TEnum[]}
 */
const _enumToArray = <TEnum = any>(enumObject: any): TEnum[] =>
    CoreUtils.objectToArray(_numericEnumToPojo(enumObject)) as TEnum[];

/**
 * Returns a random enum value from its type
 *
 * @example
 * const randomRoleType = TestUtils.getRandomEnum<RoleType>(RoleType);
 * // Might return the value '1', which is the value of RoleType.Team
 * @template TEnum The enum to be transformed
 * @param {*} enumObject The enum to be transformed (cannot be typed to TEnum, or TS will return 'typeof TEnum'
 * instead of a value of TEnum)
 * @param {TEnum} [excludeElement] A specific enum value to be excluded from the random selection.
 * @returns {TEnum}
 */
const _getRandomEnum = <TEnum = any>(
    enumObject: any,
    excludeElement?: TEnum
): TEnum => {
    let enumValues = _enumToArray(enumObject);
    if (excludeElement != null) {
        enumValues = enumValues.filter(
            (enumObject: any) => enumObject !== excludeElement
        );
    }
    return faker.random.arrayElement(enumValues);
};

/**
 * Transforms an enum into an object containing the keys and values of the enum
 *
 * @param {*} enumObject
 * @returns {{}}
 */
const _numericEnumToPojo = (enumObject: any): {} => {
    let pojo: { [k: string]: any } = {};

    for (const key in enumObject) {
        if (isNaN(parseInt(key))) {
            pojo[key] = enumObject[key];
        }
    }

    return pojo;
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const TestUtils = {
    enumToArray: _enumToArray,
    getRandomEnum: _getRandomEnum,
    numericEnumToPojo: _numericEnumToPojo,
};

// #endregion Exports
