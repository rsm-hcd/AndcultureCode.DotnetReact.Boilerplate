/**
 * Represents the returned object from hooks wrapping Publication service calls - ie `use-section`,
 * `use-chapter`, etc. `T` represents the domain object(s) being retrieved.
 *
 * @export
 * @interface PublicationServiceHook
 * @template T
 */
export default interface ServiceHookResult<T> {
    errors: string[];
    loaded: boolean;
    loading: boolean;
    resultObject: T;
}
