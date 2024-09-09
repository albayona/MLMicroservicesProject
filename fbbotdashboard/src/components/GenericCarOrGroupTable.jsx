import * as React from "react";
import {useMemo, useState} from "react";
import {INDEXES_GROUP_TYPE, useGroupState, useGroupStateDispatch} from "../contexts/GroupContext";
import GroupTable from "./GroupTable/GroupTable";
import Box from "@mui/material/Box";
import {useAuth} from "../contexts/UserContext";
import {CONTENT_HOST, useFetchContentAPI} from "../hooks/UseFetch";
import {useUpdate} from "../contexts/UpdateContext";
import NewCarsTable from "./CarTable/NewCarsTable";
import {parseDate} from "../utils/utils.py";
import {styled} from "@mui/material/styles";
import {InputFilters} from "./GroupTable/FilterInputs";


export const CustomBox = styled(Box)(({theme, isgrouptable, isroot}) => {
    const rootTableStyles = {
        backgroundColor: theme.palette.common.white,
    };

    const groupTableStyles = {
        borderLeft: 'solid',
        borderLeftColor: theme.palette.secondary.light,
        backgroundColor: theme.palette.common.white,
        marginLeft: theme.spacing(6),
        transition: 'background-color 0.03s ease, transform 0.3s ease',
        '&:hover': {
            borderLeftColor: theme.palette.primary.main,
            transform: 'scale(1.01)',
            cursor: 'pointer',
        },
    };

    const tableStyles = {
        borderLeft: 'solid',
        borderLeftColor: theme.palette.primary.light,
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.white,
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        '&:hover': {
            cursor: 'pointer',
        },
    };

    if (isroot === 'true') {
        return rootTableStyles;
    } else if (isgrouptable === 'true') {
        return groupTableStyles;
    } else {
        return tableStyles;
    }
});


export const GenericCarOrGroupTable = () => {

    const groupState = useGroupState();
    const groupStateDispatch = useGroupStateDispatch();
    const {needUpdate, removeSubscriberToUpdate, addSubscriberToUpdate} = useUpdate();
    const [searchTerm, setSearchTerm] = useState('');
    const [upperBoundS, setUpperBoundS] = useState(-1);
    const [lowerBoundS, setLowerBoundS] = useState(-1);
    const [paginationQueryParams, setPaginationQueryParams] = useState("");
    const subId = (groupState.acumGroupValue.length > 0) ? groupState.acumGroupValue.join('XX') : 'root';
    const update = needUpdate(subId);

    // console.log(`GenericCarOrGroupTable${groupState.level}`, groupState, update);

    return <GenericCarOrGroupTableMemo needUpdate={update} removeSubscriberToUpdate={removeSubscriberToUpdate}
                                       groupState={groupState} groupStateDispatch={groupStateDispatch}
                                       addSubscriberToUpdate={addSubscriberToUpdate} subId={subId}
                                       lowerBoundS={lowerBoundS} upperBoundS={upperBoundS}
                                       searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                                       setLowerBoundS={setLowerBoundS} setUpperBoundS={setUpperBoundS}
                                       paginationQueryParams={paginationQueryParams}
                                       setPaginationQueryParams={setPaginationQueryParams}
    />;
}


export const GenericCarOrGroupTableMemo = React.memo(({
                                                          needUpdate,
                                                          removeSubscriberToUpdate,
                                                          groupState,
                                                          groupStateDispatch,
                                                          addSubscriberToUpdate,
                                                          subId,
                                                          lowerBoundS,
                                                          upperBoundS,
                                                          searchTerm,
                                                          setSearchTerm,
                                                          setLowerBoundS,
                                                          setUpperBoundS,
                                                          paginationQueryParams,
                                                          setPaginationQueryParams,
                                                      }) => {
    // console.log(`GenericCarOrGroupTableMemo${groupState.level}`, groupState.acumGroupValue, needUpdate);
    const memoGroupValues = useMemo(() => (groupState.groupValues), [groupState.groupValues]);

    const {token} = useAuth();
    const {user} = useAuth();

    const isGroupTable = groupState.groupIndex !== 0;
    const isRoot = groupState.acumGroupIndex.length === 0;

    const updateRequest = generateRequest(isGroupTable, groupState, needUpdate, token, user, groupStateDispatch,
        removeSubscriberToUpdate, subId, paginationQueryParams);
    // console.log('updateRequest', updateRequest)
    const [error, isLoading] = useFetchContentAPI(updateRequest);


    const boundCondition = lowerBoundS < upperBoundS;


    const filteredGroups = manageGroupFilter(memoGroupValues, groupState, searchTerm, boundCondition, lowerBoundS, upperBoundS);

    const table = isGroupTable ? <GroupTable
            groupStateDispatch={groupStateDispatch}
            groupIndex={groupState.groupIndex}
            groupValues={filteredGroups}
            acumGroupIndex={groupState.acumGroupIndex}
            acumGroupValue={groupState.acumGroupValue}
            addSubscriberToUpdate={addSubscriberToUpdate}
        /> :
        <NewCarsTable
            carValues={groupState.carValues}
            acumGroupValues={groupState.acumGroupValue}
            acumGroupIndex={groupState.acumGroupIndex}
            addSubscriberToUpdate={addSubscriberToUpdate}
            setQueryParams={setPaginationQueryParams}
            isLoading={isLoading}
        />;


    return (<CustomBox sx={{maxWidth: '100%'}} isgrouptable={`${isGroupTable}`} isroot={`${isRoot}`}>
        <InputFilters
            groupState={groupState}
            searchTerm={searchTerm}
            lowerBoundS={lowerBoundS}
            upperBoundS={upperBoundS}
            groupStateDispatch={groupStateDispatch}
            setSearchTerm={setSearchTerm}
            setLowerBoundS={setLowerBoundS}
            setUpperBoundS={setUpperBoundS}
        />
        {table}
    </CustomBox>);

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

function generateRequest(isGroupTable, groupState, needUpdate, token, user, groupStateDispatch,
                         removeSubscriberToUpdate, subId, paginationQueryParams) {

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
                groupStateDispatch({type: 'updateCarValues', carValues: data})
            }
            console.log(`Remove: ${subId}`);
            removeSubscriberToUpdate(subId);
        },
        method: method,
        headers: headers,
        endpoint: `${CONTENT_HOST}/${endpoint}?${queryParams}&${paginationQueryParams}`,
        payload: null,
    };
}


function areGenericCarOrGroupTableMemoPropsEqual(oldProps, newProps) {
    // console.log('areGenericCarOrGroupTableMemoPropsEqual', oldProps, newProps);
    return oldProps.groupState.groupIndex === newProps.groupState.groupIndex &&
        oldProps.paginationQueryParams === newProps.paginationQueryParams &&
        oldProps.searchTerm === newProps.searchTerm &&
        oldProps.lowerBoundS === newProps.lowerBoundS &&
        oldProps.upperBoundS === newProps.upperBoundS &&
        oldProps.groupState.needUpdate === newProps.groupState.needUpdate &&
        oldProps.needUpdate === newProps.needUpdate &&
        oldProps.groupState.groupValues.length === newProps.groupState.groupValues.length &&
        oldProps.groupState.carValues.results?.length === newProps.groupState.carValues.results?.length &&
        oldProps.groupState.groupValues.every((oldVal, index) => {
            const newVal = newProps.groupState.groupValues[index];
            return oldVal === newVal;
        }) &&
        oldProps.groupState.carValues.results?.every((oldVal, index) => {
            const newVal = newProps.groupState.carValues[index];
            return oldVal === newVal;
        })
}

function manageGroupFilter(memoGroupValues, groupState, searchTerm, boundCondition, lowerBound, upperBound) {
    let filteredGroups = memoGroupValues;

    if (INDEXES_GROUP_TYPE[groupState.groupIndex] === 'Text'  && searchTerm) {
        filteredGroups = memoGroupValues.filter((item) => {
            return item[0].toLowerCase().includes(searchTerm.toLowerCase());
        });
    } else if (lowerBound >= 0 && upperBound >= 0 && groupState.groupIndex === 4 && boundCondition) {
        filteredGroups = memoGroupValues.filter((item) => {
            return parseInt(item[0]) >= lowerBound && parseInt(item[0]) <= upperBound;
        });
    } else if (lowerBound >= 0 && upperBound >= 0 && groupState.groupIndex !== 0 && boundCondition) {
        filteredGroups = memoGroupValues.filter((item) => {
            return parseInt(item[0].split('-')[0]) >= lowerBound && parseInt(item[0].split('-')[1]) <= upperBound;
        });
    }
    return filteredGroups;
}