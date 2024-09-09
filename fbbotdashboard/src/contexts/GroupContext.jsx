import {createContext, useContext, useEffect, useReducer} from 'react';
import {useUpdate} from "./UpdateContext";
import {orderedAcumValues} from "../utils/utils.py";

export const GroupContext = createContext(null);
export const GroupDispatchContext = createContext(null);

export const INDEXES_GROUP_NAME = {
    0: "No Grouping",
    1: "Brand",
    2: "Price",
    3: "Miles",
    4: "Year",
    5: "Place",
};

export const INDEXES_GROUP_TYPE = {
    0: "None",
    1: "Text",
    2: "Number",
    3: "Number",
    4: "Number",
    5: "Text",
};


export function GroupProvider({children, prevGroupValue, prevGroupIndex}) {
    const parentGroupState = useGroupState();
    const acumGroupValue = [...parentGroupState.acumGroupValue, prevGroupValue];
    const acumGroupIndex = [...parentGroupState.acumGroupIndex, prevGroupIndex];

    const initialState = {
        needUpdate: true,
        groupIndex: 0,
        acumGroupIndex: acumGroupIndex,
        groupValues: [],
        carValues: {},
        acumGroupValue: acumGroupValue,
        sseUpdate: "",
        level: parentGroupState.level + 1,
    };


    const {subscribers, addSubscriber, removeSubscriber} = useUpdate();

    useEffect(() => {
        if (!subscribers.includes(acumGroupValue)) {
            addSubscriber(orderedAcumValues(acumGroupValue, acumGroupIndex).join('XX'));
        }
        return () => {
            removeSubscriber(orderedAcumValues(acumGroupValue, acumGroupIndex).join('XX'));
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
        groupIndex: 1,
        acumGroupIndex: [],
        groupValues: [],
        carValues: {},
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