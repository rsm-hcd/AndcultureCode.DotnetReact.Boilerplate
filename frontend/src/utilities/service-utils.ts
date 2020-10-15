import GlobalStateRecord from "models/view-models/global-state-record";
import { GlobalStateUpdater } from "./contexts/use-global-state-context";
import { AxiosResponse } from "axios";
import { PromiseFactory, ResultRecord } from "andculturecode-javascript-core";
import { ServiceUtils as AndcultureCodeServiceUtils } from "andculturecode-javascript-core";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

interface ServicesConfiguration {
    cultureCode?: string;
    globalState: GlobalStateRecord;
    setGlobalState: GlobalStateUpdater;
}

/*
-------------------------------------------------------------------------------------------2--
Variables
---------------------------------------------------------------------------------------------
*/

let _configuration: ServicesConfiguration;

/*
---------------------------------------------------------------------------------------------
Functions
---------------------------------------------------------------------------------------------
*/

/**
 * Configure services globally
 */
const configure = (configuration: ServicesConfiguration) => {
    _configuration = configuration;

    AndcultureCodeServiceUtils.configure(
        _configuration.cultureCode,
        handleApiResponseError,
        handleApiResponseSuccess
    );
};

/*
---------------------------------------------------------------------------------------------
Event Handlers
---------------------------------------------------------------------------------------------
*/

const handleApiResponseError = (error: any) => {
    if (error == null || error.response == null) {
        return Promise.reject(error);
    }

    const response = error.response;

    // Handle global HTTP status codes
    switch (response.status) {
        case 401: {
            _configuration.setGlobalState(
                _configuration.globalState.setUnauthenticated()
            );
            return PromiseFactory.pending(); // Short-circuit promise chain
        }
        case 403: {
            // Try to instantiate a new ResultRecord from the response data, if it is an actual object
            let resultRecord = new ResultRecord().addError("Unknown", error);
            if (response.data != null && typeof response.data === "object") {
                resultRecord = new ResultRecord(response.data);
            }

            _configuration.setGlobalState(
                _configuration.globalState.with({
                    unauthorizedResult: resultRecord,
                })
            );
            return PromiseFactory.pending(); // Short-circuit promise chain
        }
    }

    // If shape of a Result, directly wrap in result record
    const data = response.data;
    if (data != null && data.errors != null) {
        return Promise.reject(new ResultRecord(data));
    }

    // Wrap unhandled error in result record
    let unhandledResult = new ResultRecord();
    unhandledResult = unhandledResult.addError("Unknown", error);
    return Promise.reject(unhandledResult);
};

const handleApiResponseSuccess = (response: AxiosResponse) => response;

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

const ServiceUtils = {
    configure,
    handleApiResponseError,
    handleApiResponseSuccess,
};

export default ServiceUtils;
