import * as React from 'react';
import {memo} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Chip, emphasize, TablePagination} from "@mui/material";
import {styled} from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import {CollapsibleRow} from "./CollapsibleRow";
import NumbersIcon from '@mui/icons-material/Numbers';

const StyledTableCell2 = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontSize: 24,
}));

export const CustomChip = styled(Chip)(({theme}) => {
    const backgroundColor = theme.palette.secondary.light;
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

export const CustomChip2 = styled(Chip)(({theme}) => {
    const backgroundColor = theme.palette.primary.main;
    return {
        backgroundColor,
        height: theme.spacing(5),
        color: theme.palette.primary.contrastText,
        fontWeight: theme.typography.fontWeightBold,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

function areGroupTablePropsEqual(oldProps, newProps) {
    return (
        oldProps.groupValues.length === newProps.groupValues.length &&
        oldProps.groupValues.every((oldVal, index) => {
            const newVal = newProps.groupValues[index];
            return oldVal[0] === newVal[0] && oldVal[1] === newVal[1];
        })
    );
}


const GroupTable = memo(({groupStateDispatch, groupIndex, groupValues, acumGroupIndex, acumGroupValue}) => {
    // console.log('GroupTable');

    return (<Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}} elevation={5}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell2/>
                            <StyledTableCell2>

                                <CustomChip
                                    component="a"
                                    href="#"
                                    label="grouping"
                                />

                            </StyledTableCell2>
                            <StyledTableCell2/>
                            <StyledTableCell2 align="right">

                                <CustomChip icon={<NumbersIcon/>}></CustomChip>
                            </StyledTableCell2>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupValues
                            .map((groupVal) => (<CollapsibleRow
                                key={groupVal[0]}
                                dispatch={groupStateDispatch}
                                groupValue={groupVal}
                                groupIndex={groupIndex}
                                acumGroupIndex={acumGroupIndex}
                                acumGroupValue={acumGroupValue}
                            />))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    </Box>);
}, areGroupTablePropsEqual);
export default GroupTable;