import GlobalStateRecord from "models/view-models/global-state-record";
import { GlobalStateUpdater } from "./contexts/use-global-state-context";
import { AxiosResponse } from "axios";
import ResultRecord from "models/view-models/result-record";
import ServiceResponse from "utilities/interfaces/service-response";
import Result from "models/interfaces/result";
import PagedResult from "models/interfaces/paged-result";
import PromiseFactory from "utilities/promises/promise-factory";
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

/**
 * Translates axios specific data response to a more generic ServiceResponse
 * type for consumption throughout the system
 */
const mapAxiosResponse = function<TRecord>(
    recordType: { new (props: Partial<TRecord>): TRecord },
    axiosResponse: AxiosResponse<Result<TRecord>>
): ServiceResponse<TRecord> {
    if (axiosResponse == null) {
        return axiosResponse;
    }

    // Ensure result data is wrapped within a record
    let resultObject;
    if (axiosResponse.data != null && axiosResponse.data.resultObject != null) {
        resultObject = new recordType(axiosResponse.data.resultObject);
        axiosResponse.data.resultObject = resultObject;
    }

    return {
        result: new ResultRecord<TRecord>(axiosResponse.data),
        resultObject: resultObject,
        rowCount: 1,
        status: axiosResponse.status,
    };
};

/**
 * Translates axios specific data responses to a more generic ServiceResponse
 * type for consumption throughout the system
 */
const mapPagedAxiosResponse = function<TRecord>(
    recordType: { new (props: Partial<TRecord>): TRecord },
    axiosResponse: AxiosResponse<PagedResult<TRecord>>
): ServiceResponse<TRecord> {
    if (axiosResponse == null) {
        return axiosResponse;
    }
    const data = axiosResponse.data;

    // Ensure result data is wrapped within records
    let resultObjects;
    if (
        data != null &&
        data.resultObject != null &&
        data.resultObject.length > 0
    ) {
        resultObjects = data.resultObject.map((r) => new recordType(r));
        data.resultObject = resultObjects;
    }

    return {
        results: new ResultRecord<TRecord[]>(data),
        resultObjects: resultObjects,
        rowCount: axiosResponse.data.rowCount,
        status: axiosResponse.status,
    };
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
    mapAxiosResponse,
    mapPagedAxiosResponse,
};

export default ServiceUtils;
