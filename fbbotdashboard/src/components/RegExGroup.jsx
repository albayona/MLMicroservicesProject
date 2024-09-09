import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import * as React from "react";
import Box from "@mui/material/Box";
import {Chip, FormControl, Radio, RadioGroup, Stack} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import {RegEx} from "./RegEx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from "@mui/material/IconButton";
import {v4 as uuid} from 'uuid';
import {RegexProvider, useRegexContext} from "../contexts/RegexContext";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";

const CustomPaper = styled(Paper)(({theme}) => {
    return {
        border: '1px dashed',
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
        padding: theme.spacing(1),
    };
});

export const RegExRoot = () => {
    const {updateNestedRegexObject, getInitialRegexState} = useRegexContext();
    const state = getInitialRegexState('', -1, true);

    console.log('state', state);

    let initialState = {
        regexClass: 'regex',
        logicalConnector: state?.logicalConnector || 'AND'
    };

    const [formState, setFormState] = React.useState(initialState);

    const handleLogicalConnectorChange = (event) => {
        setFormState(prevState => ({
            ...prevState,
            logicalConnector: event.target.value,
        }));

        updateNestedRegexObject({logicalConnector: event.target.value}, -1, '', true, true);
    };

    return (
        <RegExGroup nestedLevel='' logicalConnector={formState.logicalConnector}
                    handleLogicalConnectorChange={handleLogicalConnectorChange}/>
    );
};


export const RegExGroup = ({nestedLevel, logicalConnector, handleLogicalConnectorChange}) => {

    const {
        addNestedRegexObject, removeNestedRegexObject, strRegex, getInitialRegexGroupStateLength
    } = useRegexContext();

    console.log('strRegex', strRegex);

    const [idList, setIdList] = React.useState(generateUuidArray(getInitialRegexGroupStateLength(nestedLevel)));
    console.log('idList', idList);

    const addRegEx = () => {
        setIdList([...idList, uuid()]);
        addNestedRegexObject(nestedLevel);
    };


    const removeRegEx = (uuid) => {
        const newList = idList.filter((id) => id !== uuid);
        setIdList(newList);

        const indexToRemove = idList.findIndex(item => item.id === uuid);
        removeNestedRegexObject(nestedLevel, indexToRemove);
    };

    function generateUuidArray(length) {
        return Array.from({length}, () => uuid());
    }


    return (<Box
        sx={{
            display: 'flex', flexWrap: 'wrap', '& > :not(style)': {
                m: 1, width: 'auto', height: '100%',
            },
        }}
    >
        <CustomPaper variant='outlined'>
            <Stack alignItems="center">
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={logicalConnector}
                        onChange={handleLogicalConnectorChange}
                        row
                    >
                        <FormControlLabel value="OR"
                                          control={<Radio color="primary"/>}
                                          label={
                                              <Typography variant="button" gutterBottom sx={{display: 'block'}}
                                                          color="primary">
                                                  OR
                                              </Typography>}/>
                        <FormControlLabel value="AND"
                                          control={<Radio color="primary"/>}
                                          label={
                                              <Typography variant="button" gutterBottom sx={{display: 'block'}}
                                                          color="primary">
                                                  AND
                                              </Typography>}/>
                    </RadioGroup>
                </FormControl>
            </Stack>


            <Stack alignItems="center" spacing={0} divider={<Stack alignItems="center">
                <Chip label={<Typography variant="button" gutterBottom>
                    {logicalConnector}
                </Typography>} color="primary"/>
            </Stack>}>
                {idList.map((id, index) => {
                    return <RegEx key={id} id={id} index={index} removeRegEx={removeRegEx} nestedLevel={nestedLevel}/>
                })}

            </Stack>
            <Stack alignItems="center">
                <IconButton aria-label="add" color="primary" onClick={addRegEx}>
                    <AddCircleOutlineIcon/>
                </IconButton>
            </Stack>
        </CustomPaper>

    </Box>);
};