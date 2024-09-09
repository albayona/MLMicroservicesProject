import {
    Chip, FormControl, FormHelperText, InputAdornment, InputLabel, Select, SelectChangeEvent, Stack, TextField
} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import {INDEXES_GROUP_NAME, INDEXES_GROUP_TYPE} from "../../contexts/GroupContext";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import {HighlightAutocomplete} from "../utils/HighlightAutocomplete";
import Paper from "@mui/material/Paper";


export const InputFilters = ({
                                 groupState,
                                 searchTerm,
                                 lowerBoundS,
                                 upperBoundS,
                                 groupStateDispatch,
                                 setSearchTerm,
                                 setLowerBoundS,
                                 setUpperBoundS,
                             }) => {


    const menuItems = [0, 1, 2, 3, 4, 5].filter((item) => !groupState.acumGroupIndex.includes(item))

    console.log(lowerBoundS, upperBoundS, 'lowerBoundS, upperBoundS')

    let bounds = null;
    if (!groupState.needUpdate && groupState.groupValues.length > 0) {
        if (groupState.groupIndex === 2) {
            bounds = getPriceSelectBoundList(groupState);
        } else if (groupState.groupIndex === 3) {
            bounds = getMilesSelectBoundList(groupState);
        } else if (groupState.groupIndex === 4) {
            bounds = getYearSelectBoundList(groupState);
            console.log(bounds, 'bounds');
        }
    }

    // console.log(bounds, 'bounds');

    const boundValidation = getBoundValidation(upperBoundS, lowerBoundS);
    const boundCondition = lowerBoundS < upperBoundS;


    const handleGroupIndexChange = (event: SelectChangeEvent) => {
        groupStateDispatch({type: 'selectGroup', groupIndex: event.target.value});
        setLowerBoundS(-1);
        setUpperBoundS(-1);
    };


    const handleSearchChange = (event: SelectChangeEvent) => {

        setSearchTerm(event.target.value);
    };

    const handleLowerBoundChange = (event, newValue) => {
        console.log(newValue);
        setLowerBoundS(parseInt(newValue));
    };

    const handleUpperBoundChange = (event, newValue) => {
        setUpperBoundS(parseInt(newValue));
    };

    const errorCondition = !boundCondition && (lowerBoundS >= 0 && upperBoundS >= 0);

    // console.log(errorCondition, 'errorCondition', lowerBoundS, upperBoundS, boundCondition);

    return (<Stack direction="row" spacing={2}>
        <FormControl>
            {menuItems.length > 1 && <React.Fragment>
                <InputLabel id="select-group-label">Grouping</InputLabel>
                <Select
                    labelId="select-group-label"
                    id="group-select"
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


        {(INDEXES_GROUP_TYPE[groupState.groupIndex] === 'Text' && groupState.groupValues.length > 0) &&
            <Paper variant="outlined" sx={{p: 0.8}}>
                <TextField
                    autoComplete="on"
                    label="Search"
                    variant='standard'
                    color='secondary'
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start">
                            <SearchIcon sx={{color: 'secondary.main'}}/>
                        </InputAdornment>),
                    }}
                />
            </Paper>}

        {(INDEXES_GROUP_TYPE[groupState.groupIndex] === 'Number' && !groupState.needUpdate && groupState.groupValues.length > 0) &&
            <React.Fragment>
                <FormControl error={errorCondition}>
                    <Paper variant="outlined" sx={{p: 0.8}}>
                        <HighlightAutocomplete keys={Object.keys(bounds)}
                                               dict={bounds}
                                               handler={handleLowerBoundChange}
                                               label='Lower bound'
                                               icon={<ArrowBackIosIcon sx={{color: 'secondary.main'}}/>}
                                               variant='standard'
                                               width={200}
                        />
                        <FormHelperText>{boundValidation}</FormHelperText>
                    </Paper>

                </FormControl>

                <FormControl error={errorCondition}>
                    <Paper variant="outlined" sx={{p: 0.8}}>
                        <HighlightAutocomplete keys={Object.keys(bounds)}
                                               dict={bounds}
                                               handler={handleUpperBoundChange}
                                               label='Upper bound'
                                               icon={<ArrowForwardIosIcon
                                                   sx={{color: 'secondary.main'}}/>}
                                               variant='standard'
                                               width={200}
                        />
                        <FormHelperText>{boundValidation}</FormHelperText>
                    </Paper>

                </FormControl>
            </React.Fragment>}
    </Stack>);
};


function getBoundValidation(upperBound, lowerBound) {
    let boundValidation = '';

    if (upperBound >= 0 && lowerBound >= 0) {
        if (lowerBound >= upperBound) {
            boundValidation = 'Lower bound must be less than upper bound.';
        }
    }
    return boundValidation;
}


function getPriceSelectBoundList(groupState) {
    let priceBounds = {'-1': 'None'};

    const min = parseInt(groupState.groupValues[0][0].split('-')[0]);
    const max = parseInt(groupState.groupValues[groupState.groupValues.length - 1][0].split('-')[1]);

    for (let i = min; i <= max; i += 5000) {
        priceBounds[`${i}`] = `$${i}`
    }
    return priceBounds;
}

function getMilesSelectBoundList(groupState) {
    let listBounds = {'-1': 'None'};

    const min = parseInt(groupState.groupValues[0][0].split('-')[0]);
    const max = parseInt(groupState.groupValues[groupState.groupValues.length - 1][0].split('-')[1]);

    for (let i = min; i <= max; i += 25000) {
        listBounds[`${i}`] = `${i / 1000}k mi`

    }
    return listBounds;
}

function getYearSelectBoundList(groupState) {
    let listBounds = {'-1': 'None'};

    const min = Math.max(parseInt(groupState.groupValues[0][0]), 1998);
    const max = parseInt(groupState.groupValues[groupState.groupValues.length - 1][0]);

    for (let i = min; i <= max; i++) {
        listBounds[`${i}`] = `${i}`
    }
    return listBounds;
}
