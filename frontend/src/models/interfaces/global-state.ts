import IdentityRecord from "models/view-models/identity-record";
import { ResultRecord } from "andculturecode-javascript-core";

export default interface GlobalState {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    /**
     * Contains the current user's UserLogin entity (if logged in).
     *
     * @type {IdentityRecord}
     * @memberof GlobalState
     */
    currentIdentity?: IdentityRecord;

    /**
     * ResultRecord from a 403 API response.
     *
     * @type {ResultRecord<any>}
     * @memberof GlobalState
     */
    unauthorizedResult?: ResultRecord<any>;

    // #endregion Properties
}
