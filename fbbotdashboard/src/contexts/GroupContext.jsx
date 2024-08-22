import {createContext, useContext, useEffect, useReducer, useState} from 'react';
import {UpdateContext, useUpdate} from "./updateContext";

export const GroupContext = createContext(null);
export const GroupDispatchContext = createContext(null);

export const INDEXES_GROUP_NAME = {
    0: "Brand",
    1: "Price",
    2: "Miles",
    3: "Year",
    4: "No Grouping"
};


export function GroupProvider({children, prevGroupValue, prevGroupIndex}) {
    const parentGroupState = useGroupState();
    const acumGroupValue = [...parentGroupState.acumGroupValue, prevGroupValue];

    const initialState = {
        needUpdate: true,
        groupIndex: 4,
        acumGroupIndex: [...parentGroupState.acumGroupIndex, prevGroupIndex],
        groupValues: [],
        carValues: [],
        acumGroupValue: acumGroupValue,
        sseUpdate: "",
        level: parentGroupState.level + 1,
    };


    const {subscribers, addSubscriber, removeSubscriber} = useUpdate();

    useEffect(() => {
        if (!subscribers.includes(acumGroupValue)) {
            addSubscriber(acumGroupValue.join('XX'));
        }
        return () => {
            removeSubscriber(acumGroupValue.join('XX'));
        }
    }, []);


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


export function RootGroupProvider({children}) {
    useUpdate("root");

    const initialState = {
        needUpdate: true,
        groupIndex: 0,
        acumGroupIndex: [],
        groupValues: [],
        carValues: [],
        acumGroupValue: [],
        sseUpdate: "",
        level: 0,
    };


    const [groupState, dispatch] = useReducer(
        groupStateReducer,
        initialState
    );


    const {subscribers, addSubscriber, removeSubscriber} = useUpdate();

    useEffect(() => {
        if (!subscribers.includes("root")) {
            addSubscriber("root");
        }
        return () => {
            removeSubscriber("root");
        }
    }, []);

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

export function useGroupStateDispatch() {
    return useContext(GroupDispatchContext);
}


function groupStateReducer(groupState, action) {

    switch (action.type) {
        case "updateGroupValues":
            return {...groupState, groupValues: action.groupValues, needUpdate: false};
        case "updateCarValues":
            return {...groupState, carValues: action.carValues, needUpdate: false};
        case "selectGroup":
            return {...groupState, groupIndex: action.groupIndex, needUpdate: true};
        case "requestUpdate":
            return {...groupState, needUpdate: true};
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}