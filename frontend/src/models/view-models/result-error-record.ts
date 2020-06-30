import { Record } from "immutable";
import ErrorType from "utilities/enumerations/error-type";
import ResultError from "models/interfaces/result-error";

const defaultValues: ResultError = {
    key: undefined,
    message: undefined,
    type: ErrorType.Error,
};

export default class ResultErrorRecord extends Record(defaultValues)
    implements ResultError {
    /*
    ---------------------------------------------------------------------------------------------
    Properties
    ---------------------------------------------------------------------------------------------
    */

    // Do NOT set properties on immutable records due to babel and typescript transpilation issue
    // See https://github.com/facebook/create-react-app/issues/6506

    /*
    ---------------------------------------------------------------------------------------------
    Constructor
    ---------------------------------------------------------------------------------------------
    */

    constructor(params?: ResultError) {
        if (params == null) {
            params = {};
        }

        if (params.type == null) {
            params.type = ErrorType.Error;
        }

        super(params);
    }

    public with(values: Partial<ResultError>): ResultErrorRecord {
        return new ResultErrorRecord(Object.assign(this.toJS(), values));
    }

    /*
    ---------------------------------------------------------------------------------------------
    Public Methods
    ---------------------------------------------------------------------------------------------
    */

    /**
     * Display error key and message
     */
    public fullError(): string {
        return `${this.key}: ${this.message}`;
    }
}
