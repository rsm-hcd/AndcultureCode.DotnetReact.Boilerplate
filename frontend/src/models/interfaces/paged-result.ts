import ResultErrorRecord from "models/view-models/result-error-record";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

export default interface PagedResult<T> {
    errors?: ResultErrorRecord[];
    resultObject?: T[];
    rowCount: number;
}
