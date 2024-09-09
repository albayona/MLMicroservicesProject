import {styled} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import {memo, useState} from "react";
import {CONTENT_HOST, useFetchContentAPI} from "../../hooks/UseFetch";
import {Breadcrumbs, Button, Chip, Grid, Skeleton} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAuth} from "../../contexts/UserContext";
import {CustomChip, CustomChip2} from "./GroupTable";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimelineIcon from "@mui/icons-material/Timeline";
import TodayIcon from "@mui/icons-material/Today";
import Box from "@mui/material/Box";
import {orderedAcumValues} from "../../utils/utils.py";
import LocationOnIcon from '@mui/icons-material/LocationOn';


const Item = styled(Box)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const StyledCell = styled(TableCell)(({theme}) => ({
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


export const Row = memo(({groupValue, groupIndex, acumGroupIndex, acumGroupValue, addSubscriberToUpdate}) => {
    const groupValueName = groupValue[0];
    const groupValueCount = groupValue[1];

    const {token} = useAuth();
    const {user} = useAuth();

    const [archiveAllTrigger, setArchiveAllTrigger] = useState(false);

    const archiveAllRequest = {
        triggerRequest: archiveAllTrigger,
        callback: () => {

            setArchiveAllTrigger(false)
            if (acumGroupIndex.length === 0) {
                addSubscriberToUpdate('root')
            } else {
                addSubscriberToUpdate(orderedAcumValues(acumGroupValue, acumGroupIndex).join('XX'));
            }
        },
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Consumer-Custom-Id': user,
        },
        endpoint: `${CONTENT_HOST}/mark-group-seen/`,
        payload: generatePayload(acumGroupIndex, acumGroupValue, groupIndex, groupValue)
    }

    const archiveAllError = useFetchContentAPI(archiveAllRequest);


    const groupIconsByIndex = (index, color) => {
        if (index === 1) {
            return <DirectionsCarIcon color={color}/>
        } else if (index === 2) {
            return <AttachMoneyIcon color={color}/>
        } else if (index === 3) {
            return <TimelineIcon color={color}/>
        } else if (index === 4) {
            return <TodayIcon color={color}/>
        } else if (index === 5) {
            return <LocationOnIcon color={color}/>
        } else {
            return null
        }
    }

    function archiveAll() {
        setArchiveAllTrigger(true);
    }

    return (<React.Fragment>
        <Box sx={{flexGrow: 1, width: '100%'}}>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Item>
                        <Breadcrumbs aria-label="breadcrumb">
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
                        </Breadcrumbs>
                    </Item>
                </Grid>
                <Grid item xs={5}>
                    <Item>

                        <Button onClick={archiveAll} variant="contained" color="secondary">Archive all
                            group</Button>
                    </Item>
                </Grid>
                <Grid item xs={1}>
                    <Item>
                        <Chip label={<Typography variant="h6" gutterBottom>
                            {groupValueCount}
                        </Typography>

                        } size="medium" color="primary"/>
                    </Item>
                </Grid>
            </Grid>
        </Box>


    </React.Fragment>);
}, areCollapsibleRowPropsEqual);


function generatePayload(acumGroupIndex, acumGroupValue, groupIndex, groupValue) {
    let payload = {groups: []};

    if (groupIndex !== 0) {
        payload.groups = [{index: groupIndex, value: groupValue[0]}];
    }

    if (acumGroupValue.length > 0) {
        const acum = acumGroupValue.map((value, index) => {
            return {index: acumGroupIndex[index], value: value}
        });
        payload.groups = payload.groups.concat(acum);
    }

    return payload;
}