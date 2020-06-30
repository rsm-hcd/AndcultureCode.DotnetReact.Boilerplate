import ResultErrorRecord from "models/view-models/result-error-record";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

export default interface Result<T> {
    errors?: ResultErrorRecord[];
    resultObject?: T;
}
