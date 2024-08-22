import {styled} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import {memo, useState} from "react";
import {CONTENT_HOST, useFetchContentAPI, useFetchPutCars} from "../hooks/UseFetch";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Breadcrumbs, Button, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import {GenericCarOrGroupTable} from "./GenericCarOrGroupTable";
import {GroupProvider, RootGroupProvider, useGroupState, useGroupStateDispatch} from "../contexts/GroupContext";
import {useAuth} from "../contexts/UserContext";
import {CustomChip, CustomChip2} from "./GroupTable";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimelineIcon from "@mui/icons-material/Timeline";
import TodayIcon from "@mui/icons-material/Today";
import TableHead from "@mui/material/TableHead";


const StyledTableCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.light, color: theme.palette.common.white, fontSize: 24,
}));


const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.secondary.main,
    },
}));


function areCollapsibleRowPropsEqual(oldProps, newProps) {
    return oldProps.groupValue[0] === newProps.groupValue[0] && oldProps.groupValue[1] === newProps.groupValue[1];
}


export const CollapsibleRow = memo(({dispatch, groupValue, groupIndex, acumGroupIndex, acumGroupValue}) => {
    const [open, setOpen] = React.useState(false);

    const groupValueName = groupValue[0];
    const groupValueCount = groupValue[1];

    const {token} = useAuth();
    const {user} = useAuth();

    const [archiveAllTrigger, setArchiveAllTrigger] = useState(false);

    const archiveAllRequest = {
        triggerRequest: archiveAllTrigger, callback: () => {
            setArchiveAllTrigger(false)
            dispatch({type: 'requestUpdate'})
        }, method: 'PUT', headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Consumer-Custom-Id': user,
        }, endpoint: `${CONTENT_HOST}/see-all/`, payload: JSON.stringify({groupState: groupIndex})
    }

    const archiveAllError = useFetchContentAPI(archiveAllRequest);


    const groupIconsByIndex = (index, color) => {
        if (index === 0) {
            return <DirectionsCarIcon color={color}/>
        } else if (index === 1) {
            return <AttachMoneyIcon color={color}/>
        } else if (index === 2) {
            return <TimelineIcon color={color}/>
        } else if (index === 3) {
            return <TodayIcon color={color}/>
        } else {
            return null
        }
    }

    function archiveAll() {
        setArchiveAllTrigger(true);
    }

    return (<React.Fragment>
        <TableRow sx={{borderBottom: 'unset'}}>
            <StyledTableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
            </StyledTableCell>

            <StyledTableCell component="th" scope="row">

                {<Breadcrumbs aria-label="breadcrumb">
                    {acumGroupIndex.map((groupIndex, i) => (<CustomChip
                            key={groupIndex}
                            component="a"
                            href="#"
                            label={acumGroupValue[i]}
                            icon={groupIconsByIndex(groupIndex, "text.primary")}
                        />

                    ))}

                    <CustomChip2
                        component="a"
                        href="#"
                        label={groupValueName}
                        icon={groupIconsByIndex(groupIndex, "text.primary")}
                    />
                </Breadcrumbs>}

            </StyledTableCell>

            <StyledTableCell align="right">
                <Button onClick={archiveAll} variant="contained" color="secondary">Archive all group</Button>
            </StyledTableCell>


            <StyledTableCell align="right">
                <Chip label={<Typography variant="h6" gutterBottom>
                    {groupValueCount}
                </Typography>

                } size="medium" color="primary"/>
            </StyledTableCell>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <GroupProvider prevGroupValue={groupValue[0]} prevGroupIndex={groupIndex}>
                    <GenericCarOrGroupTable/>
                </GroupProvider>
            </Collapse>

        </TableRow>


        {/*<StyledTableRow>*/}
        {/*    <TableHead>*/}
        {/*        <TableRow>*/}
        {/*           */}
        {/*        </TableRow>*/}
        {/*    </TableHead>*/}

        {/*</StyledTableRow>*/}

    </React.Fragment>);
}, areCollapsibleRowPropsEqual);