import IdentityRecord from "models/view-models/identity-record";
import ResultRecord from "models/view-models/result-record";

export default interface GlobalState {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    /**
     * Contains the current user's UserLogin entity (if logged in). This entity will be checked
     * on each page to ensure it is still a valid login session (via Hermes)
     *
     * @type {IdentityRecord}
     * @memberof GlobalState
     */
    currentIdentity?: IdentityRecord;

    /**
     * ResultRecord from a 403 API response. This should only be non-null if an API call fails
     * due to an unconfigured user account (ie, having subscriptions, EULA, etc).
     *
     * If present, the `UserConfigurationRedirects` component should handle redirecting the user
     * to the proper step in the process.
     *
     * @type {ResultRecord<any>}
     * @memberof GlobalState
     */
    unauthorizedResult?: ResultRecord<any>;

    // #endregion Properties
}
