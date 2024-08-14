import {createContext, useContext, useReducer} from 'react';
import {useFetchAPI} from "../hooks/UseFetch";

export const GroupContext = createContext(null);
export const GroupDispatchContext = createContext(null);



export function ReduceProvider({ children }) {

    const initialState = {
        groupValues: [],
        groupSelection: 'None',
        groupValuesListUpdated: false
    };

    const [groupState, dispatch] = useReducer(
        groupStateReducer,
        initialState
    );

    return (
        <GroupContext.Provider value={groupState}>
            <GroupDispatchContext.Provider value={dispatch}>
                {children}
            </GroupDispatchContext.Provider>
        </GroupContext.Provider>
    );
}

export function useGroupState() {
    return useContext(GroupContext);
}

export function useGroupDispatch() {
    return useContext(GroupDispatchContext);
}

function groupStateReducer(groupState, action) {

    switch (action.type) {
        case "groupValues":
            return { ...groupState, selectedRepo: undefined, repos: action.newGroupValues };
        case "selectedGroup":
            return { ...groupState, selectedRepo: action.groupSelection };
        case "groupValuesListUpdated":
            return { ...groupState, groupValuesListUpdated: action.groupValuesListUpdated };
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}