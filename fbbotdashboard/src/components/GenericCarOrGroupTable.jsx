import * as React from "react";
import {useMemo} from "react";
import {INDEXES_GROUP_NAME, useGroupState, useGroupStateDispatch} from "../contexts/GroupContext";
import GroupTable from "./GroupTable";
import {Chip, FormControl, InputLabel, Select, SelectChangeEvent} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import {useAuth} from "../contexts/UserContext";
import {CONTENT_HOST, useFetchContentAPI} from "../hooks/UseFetch";
import {useUpdate} from "../contexts/updateContext";
import NewCarsTable from "./NewCarsTable";
import {parseDate} from "../utils/utils.py";

export const GenericCarOrGroupTable = () => {

    const groupState = useGroupState();
    const groupStateDispatch = useGroupStateDispatch();
    const {needUpdate, removeSubscriberToUpdate} = useUpdate();
    const update = needUpdate(groupState.acumGroupValue.join('XX'));

    return <GenericCarOrGroupTableMemo needUpdate={update} removeSubscriberToUpdate={removeSubscriberToUpdate}
                                       groupState={groupState} groupStateDispatch={groupStateDispatch}/>;
}

function areGenericCarOrGroupTableMemoPropsEqual(oldProps, newProps) {
    // console.log('areGenericCarOrGroupTableMemoPropsEqual', oldProps, newProps);
    return oldProps.groupState.groupIndex === newProps.groupState.groupIndex &&
        oldProps.groupState.needUpdate === newProps.groupState.needUpdate &&
        oldProps.groupState.acumGroupValue.length === newProps.groupState.acumGroupValue.length &&
        oldProps.groupState.acumGroupValue.every((oldVal, index) => {
            const newVal = newProps.groupState.acumGroupValue[index];
            return oldVal === newVal;
        })
}

export const GenericCarOrGroupTableMemo = React.memo(({
                                                          needUpdate,
                                                          removeSubscriberToUpdate,
                                                          groupState,
                                                          groupStateDispatch
                                                      }) => {
    console.log(`GenericCarOrGroupTableMemo${groupState.level}`, groupState, needUpdate);
    const memoGroupValues = useMemo(() => (groupState.groupValues), [groupState.groupValues]);

    const {token} = useAuth();
    const {user} = useAuth();

    const isGroupTable = groupState.groupIndex !== 4;
    const updateRequest = generateRequest(isGroupTable, groupState, needUpdate, token, user, groupStateDispatch, removeSubscriberToUpdate);

    const [error] = useFetchContentAPI(updateRequest);


    const table = isGroupTable ? <GroupTable
                groupStateDispatch={groupStateDispatch}
                groupIndex={groupState.groupIndex}
                groupValues={memoGroupValues}
                acumGroupIndex={groupState.acumGroupIndex}
                acumGroupValue={groupState.acumGroupValue}

            /> :


            <NewCarsTable
                groupStateDispatch={groupStateDispatch}
                carValues={groupState.carValues}
            />

    ;

    const handleGroupIndexChange = (event: SelectChangeEvent) => {
        groupStateDispatch({type: 'selectGroup', groupIndex: event.target.value});
    };

    const menuItems = [0, 1, 2, 3, 4].filter((item) => !groupState.acumGroupIndex.includes(item))

    return (<Box sx={{maxWidth: '100%'}}>
        <FormControl>
            {menuItems.length > 1 && <React.Fragment>
                <InputLabel id="demo-simple-select-label">Grouping</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={groupState.groupIndex}
                    label="Grouping"
                    onChange={handleGroupIndexChange}
                    renderValue={() => (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        <Chip label={INDEXES_GROUP_NAME[groupState.groupIndex]}/>
                    </Box>)}

                >
                    {menuItems.map((item) => {
                        return <MenuItem key={item} value={item}>{INDEXES_GROUP_NAME[item]}</MenuItem>
                    })}
                </Select>
            </React.Fragment>}
        </FormControl>
        {table}
    </Box>);

}, areGenericCarOrGroupTableMemoPropsEqual);


function generateQueryParams(groupState, isGroupTable) {
    let queryObject = {groupIndex: groupState.groupIndex};

    if (!isGroupTable) {
        queryObject = {}
    }

    if (groupState.acumGroupValue.length > 0) {
        const groupValuesByIndex = groupState.acumGroupValue.reduce((acc, value, index) => {
            acc[groupState.acumGroupIndex[index]] = value;
            return acc;
        }, {});
        queryObject.filter_groups = new URLSearchParams(groupValuesByIndex).toString();
    }

    return new URLSearchParams(queryObject).toString();
}

function generateRequest(isGroupTable, groupState, needUpdate, token, user, groupStateDispatch, removeSubscriberToUpdate) {
    const triggerRequest = groupState.needUpdate || needUpdate;

    const headers = {
        'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Consumer-Custom-Id': user,
    }
    const queryParams = generateQueryParams(groupState, isGroupTable);

    const method = 'GET';
    const endpoint = (isGroupTable) ? "list-multiple-groups" : "list-new-by-groups";

    return {
        triggerRequest: triggerRequest,
        callback: (data) => {
            console.log(`Updated: ${groupState.acumGroupValue}`);

            if (isGroupTable) {
                groupStateDispatch({type: 'updateGroupValues', groupValues: parseDate(data)})
            } else {
                groupStateDispatch({type: 'updateCarValues', carValues: parseDate(data)})
            }
            removeSubscriberToUpdate();
        },
        method: method,
        headers: headers,
        endpoint: `${CONTENT_HOST}/${endpoint}?${queryParams}`,
        payload: null,
    };
}
