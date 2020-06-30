import { createContext, Dispatch, SetStateAction, useContext } from "react";
import GlobalStateRecord from "models/view-models/global-state-record";

/*
-------------------------------------------------------------------------
Types
-------------------------------------------------------------------------
*/

export type GlobalStateUpdater = Dispatch<SetStateAction<GlobalStateRecord>>;

/*
-------------------------------------------------------------------------
Context
-------------------------------------------------------------------------
*/

const defaultState = new GlobalStateRecord();
const defaultUpdater: GlobalStateUpdater = () => {};
const GlobalStateContext = createContext([defaultState, defaultUpdater]);

/*
-------------------------------------------------------------------------
Hook wrapper
-------------------------------------------------------------------------
*/

/**
 * Convenience wrapper to get a typed version of our global state
 * @param context
 */
export function useGlobalState() {
    const [globalState, setGlobalState] = useContext(GlobalStateContext);

    return {
        globalState: globalState as GlobalStateRecord,
        setGlobalState: setGlobalState as GlobalStateUpdater,
    };
}

export default GlobalStateContext;
