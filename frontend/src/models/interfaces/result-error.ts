import ErrorType from "utilities/enumerations/error-type";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

export default interface ResultError {
    key?: string;
    message?: string;
    type?: ErrorType;
}
