import * as React from 'react';
import {memo} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Chip, emphasize} from "@mui/material";
import {styled} from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import {Row} from "./Row";
import NumbersIcon from '@mui/icons-material/Numbers';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

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


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

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
    const [expanded, setExpanded] = React.useState("");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (<Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}} elevation={5}>

            {groupValues
                .map((groupVal) => (

                <Accordion key= {groupVal[0]} expanded={expanded === groupVal[0]} onChange={handleChange(groupVal[0])}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Row
                            key={groupVal[0]}
                            dispatch={groupStateDispatch}
                            groupValue={groupVal}
                            groupIndex={groupIndex}
                            acumGroupIndex={acumGroupIndex}
                            acumGroupValue={acumGroupValue}
                            />
                    </AccordionSummary>
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>
                ))}
        </Paper>
    </Box>);
}, areGroupTablePropsEqual);
export default GroupTable;