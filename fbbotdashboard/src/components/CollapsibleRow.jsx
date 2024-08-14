import {styled} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import {useState} from "react";
import {CONTENT_HOST, useFetchPutCars} from "../hooks/UseFetch";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Button, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import FullFeaturedCrudGrid from "./Table";


const StyledTableCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontSize: 24,
}));


const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.secondary.main,
    }
}));


const Row = ({setActionDone, group, groupValue, count, newGroup, setNewGroup}) => {
    const [open, setOpen] = React.useState(false);
    const [removeUrl, setRemoveUrl] = useState("");
    const [refreshLoading, refreshError] = useFetchPutCars(removeUrl, setActionDone);

    function archiveAll() {
        setRemoveUrl(`${CONTENT_HOST}/see-all/${group}/${groupValue}/`)
    }

    return (
        <React.Fragment>
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
                    <Chip label={
                        <Typography variant="h6" gutterBottom>
                            {groupValue}
                        </Typography>

                    } size="medium" color="primary"/>
                </StyledTableCell>

                <StyledTableCell align="right">
                    <Button onClick={archiveAll} variant="contained">Archive all group</Button>
                </StyledTableCell>


                <StyledTableCell align="right">
                    <Chip label={
                        <Typography variant="h6" gutterBottom>
                            {count}
                        </Typography>

                    } size="medium" color="primary"/>
                </StyledTableCell>


            </TableRow>
            <StyledTableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <FullFeaturedCrudGrid url={`${CONTENT_HOST}/list-new/${group}/${groupValue}`} type="New"
                                              group={group}
                                              groupValue={groupValue}
                                              newGroup={newGroup} setNewGroup={setNewGroup}/>
                    </Collapse>
                </TableCell>

            </StyledTableRow>
        </React.Fragment>
    );
}