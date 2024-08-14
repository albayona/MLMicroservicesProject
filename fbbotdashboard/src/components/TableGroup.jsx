import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Button, Chip, FormControl, InputLabel, Select, TablePagination} from "@mui/material";
import {useEffect, useState} from "react";
import Collapse from '@mui/material/Collapse';
import {
    CONTENT_HOST,
    SSE_HOST,
    useFetchGroups, useFetchPutCars,
    useFetchRefreshGroups, useFetchRefreshGroups2, useFetchRemoveGroups
} from "../hooks/UseFetch";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import FullFeaturedCrudGrid from "./Table";
import {useAuth} from "../conntexts/UserContext";
import {styled} from '@mui/material/styles';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {SelectChangeEvent} from "@mui/material";

const StyledTableCell2 = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 24,
}));



const GROUP_INDEXES = {"brand": 0, "price_range": 1, "miles_range": 2, "year": 3, 'None': 0}
const INDEXES_GROUP = {
    0: "brand",
    1: "price_range",
    2: "miles_range",
    3: "year",
    4: "None"
};


const INDEXES_GROUP_NAME = {
    0: "Brand",
    1: "Price Range",
    2: "Miles ange",
    3: "Year",
    4: "No Grouping"
};

const ModelTable = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [group, setGroup] = React.useState('None');
    const [groupN, setGroupN] = React.useState('No Grouping');
    const [url, setUrl] = React.useState(`${CONTENT_HOST}/list-groups/None`);
    const [actionDone, setActionDone] = useState(false);
    const [groupValues, setGroupValues] = useState([]);
    const [newEvent, setNewEvent] = useState("");
    const [refreshGroupValue, setRefreshGroupValue] = useState("");
    const [isLoading, error] = useFetchGroups(url, setGroupValues);

    const [refreshLoading, refreshError] = useFetchRefreshGroups(url, setGroupValues, newEvent, setNewEvent, setRefreshGroupValue);
    const [refreshLoading2, refreshError2] = useFetchRefreshGroups2(url, setGroupValues, actionDone, setActionDone);


    const {groupAction} = useAuth();

    const handleChange = (event: SelectChangeEvent) => {
        setGroup(INDEXES_GROUP[event.target.value])
        setGroupN(INDEXES_GROUP_NAME[event.target.value])

        setUrl(`${CONTENT_HOST}/list-groups/${INDEXES_GROUP[event.target.value]}`)
        groupAction(INDEXES_GROUP[event.target.value])
        console.log(localStorage.getItem("group"), "grouping")
    };

    const {token} = useAuth();
    const {user} = useAuth();

    const extractModel = (message) => {
        const prefix = "data: ";
        if (message.startsWith(prefix)) {
            const rawData = message.slice(prefix.length).trim();
            if (rawData.startsWith("b'") && rawData.endsWith("'")) {
                return rawData.slice(2, -1);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource(`${SSE_HOST}/subscribe/user`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                },
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        console.log("Connection made ", res);
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Client side error ", res);
                    }
                },
                onmessage(event) {

                    console.log(">>>", event.data);
                    if (event.data.startsWith('data') && extractModel(event.data)) {

                        var g_values = extractModel(event.data).split('XX');
                        let g = localStorage.getItem("group");

                        if (g === null) {
                            g = "None";
                        }

                        console.log(g, "grouping")
                        setNewEvent(g_values[GROUP_INDEXES[g]]);
                    }
                },
                onclose() {
                    console.log("Connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from server", err);
                },
            });
        };

        fetchData();
    }, []);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };


    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Grouping</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={group}
                        label="Grouping"
                        onChange={handleChange}
                    >
                        <MenuItem value={0}>Brand</MenuItem>
                        <MenuItem value={1}>Price</MenuItem>
                        <MenuItem value={2}>Miles</MenuItem>
                        <MenuItem value={3}>Year</MenuItem>
                        <MenuItem value={4}>None</MenuItem>
                    </Select>
                </FormControl>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell2/>
                                <StyledTableCell2>{groupN}</StyledTableCell2>
                                <StyledTableCell2/>
                                <StyledTableCell2 align="right">#</StyledTableCell2>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupValues
                                .map((groupVal, index) => (
                                    <Row key={index} setActionDone={setActionDone} group={group}
                                         groupValue={groupVal[0]} count={groupVal[1]}
                                         newGroup={refreshGroupValue}
                                         setNewGroup={setRefreshGroupValue}/>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={groupValues.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
export default ModelTable;