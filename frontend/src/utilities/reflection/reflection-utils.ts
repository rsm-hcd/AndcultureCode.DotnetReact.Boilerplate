/**
 * Get a property name of a type in a type-safe manner
 * that will produce compiler errors if you try to get
 * a key that does not exist.
 * @param name the name of the property
 */
const nameof = <T>(name: keyof T): keyof T => name;

export { nameof };
