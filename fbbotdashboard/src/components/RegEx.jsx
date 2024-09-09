import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {FormControl, FormGroup, Stack, Switch, TextField} from "@mui/material";
import {HighlightAutocomplete} from "./utils/HighlightAutocomplete";
import * as React from "react";
import {styled} from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import {RegExGroup} from "./RegExGroup";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {useRegexContext} from "../contexts/RegexContext";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const regexClassesToDescription = {
    "regex": "regular expression",
    ".": "anything except newline",
    "\\w": "word character",
    "\\W": "non-word character",
    "\\d": "digit",
    "\\D": "non-digit",
    "\\s": "space, tab, newline",
    "\\S": "non-whitespace character",

};

const regexClassesToExpression = {
    ".": "[^\\n\\r]",
    "\\w": "[a-zA-Z0-9_]",
    "\\W": "[^\\w]",
    "\\d": "[0-9]",
    "\\D": "[^\\d]",
    "\\s": "[ \\t\\r\\n\\f]",
    "\\S": "[^\\s]"
};


const quantifiersToExpression = {
    "*": "*",
    "?": "?",
    "+": "+",
    "{1}": "{1}",
    "{n}": "{n}",
    "{n,}": "{n,}",
    "{n,m}": "{n,m}"
};

const quantifiersToDescription = {
    "*": "0 or more",
    "?": "0 or 1",
    "{1}": "exactly 1",
    "+": "1 or more",
    "{n}": "exactly n times",
    "{n,}": "n or more times",
    "{n,m}": "n to m times inclusive"
};

const quantifiers = ["{1}", "*", "?", "+", "{n}", "{n,}", "{n,m}"];
const regexClasses = ["regex", ".", "\\w", "\\W", "\\d", "\\D", "\\s", "\\S"];


const CustomPaper = styled(Paper)(({theme}) => {

    return {
        border: '1px solid',
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.common.white,
        color: theme.palette.secondary.main,
        padding: theme.spacing(1),
    };
});


export const RegEx = ({nestedLevel, removeRegEx, id, index}) => {

    const {updateNestedRegexObject, getInitialRegexState} = useRegexContext();;

    const state = getInitialRegexState(nestedLevel, index);

    console.log('state', state);

    let initialState = {
        regexClass:  state?.regexClass || '',
        quantifier:  state?.quantifier || '',
        exactMatch: (Object.keys(state).length === 0) ? true : !!state?.match,
        match: state?.match || '',
        quantify:  !!state?.quantifier,
        n: state?.n || '',
        m: state?.m || '',
        logicalConnector: state?.logicalConnector || 'AND'
    };

    console.log('initialState', initialState );

    const [formState, setFormState] = React.useState(initialState);
    console.log(formState);

    const handleLogicalConnectorChange = (event) => {
        setFormState(prevState => ({
            ...prevState,
            logicalConnector: event.target.value,
        }));
        updateNestedRegexObject({logicalConnector: event.target.value}, index, nestedLevel);
    };

    const handleRegexQuantifierChange = (field) => (event, value) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value,
        }));


        if (value === null || !value?.includes('n')) {
            updateNestedRegexObject({n: null}, index, nestedLevel);

            setFormState(prevState => ({
                ...prevState,
                n: '',
            }));

        }

        if (value === null || !value?.includes('m')) {
            updateNestedRegexObject({m: null}, index, nestedLevel);
            setFormState(prevState => ({
                ...prevState,
                m: '',
            }));

        }

        updateNestedRegexObject({[field]: value}, index, nestedLevel);

    };

    const handleRegexClassChange = (event, value) => {
        setFormState(prevState => ({
            ...prevState,
            regexClass: value,
        }));


        if (value === 'regex') updateNestedRegexObject({regexClass: value, regex: [{}]}, index, nestedLevel);
        else updateNestedRegexObject({regexClass: value}, index, nestedLevel);


    };

    const handleTextChange = (field) => (event) => {
        setFormState((prev) => {
            return {
                ...prev,
                [field]: event.target.value
            };
        });

        updateNestedRegexObject({[field]: event.target.value}, index, nestedLevel);
    };


    const handleCheckboxChange = (field) => (event) => {

        if (field === 'exactMatch') {
            setFormState((prev) => {
                return {
                    exactMatch: event.target.checked,
                    quantify: prev.quantify,
                    regexClass: '',
                    quantifier: '',
                    n: '',
                    m: '',
                    match: '',
                    logicalConnector: 'AND',
                };
            });

            updateNestedRegexObject({}, index, nestedLevel, false);

        } else if (field === 'quantify') {
            setFormState(prevState => ({
                ...prevState,
                m: '',
                n: '',
                quantifier: '',
                quantify: event.target.checked
            }));

            updateNestedRegexObject({quantifier: null, m: null, n: null}, index, nestedLevel);

        }
    };

    const handleQuantifierChange = handleRegexQuantifierChange('quantifier');
    const handleNChange = handleTextChange('n');
    const handleMChange = handleTextChange('m');
    const handleMatchChange = handleTextChange('match');
    const handleExactMatchChange = handleCheckboxChange('exactMatch');
    const handleQuantifyChange = handleCheckboxChange('quantify');
    const handleRemoveRegEx = () => removeRegEx(id);

    return (<Box
        sx={{
            display: 'flex', flexWrap: 'wrap', '& > :not(style)': {
                m: 1, width: 'auto', height: '100%',
            },
        }}
    >
        <CustomPaper variant='outlined'>
            {index > 0 && <Stack alignItems="center">
                <IconButton color="secondary" aria-label="delete" size="small" onClick={handleRemoveRegEx}>
                    <HighlightOffIcon size="small"/>
                </IconButton>
            </Stack>}
            <Stack spacing={1} alignItems="center">


                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="end"
                            control={<Switch checked={formState.exactMatch} onChange={handleExactMatchChange}
                                             color="secondary"
                                             size="small"/>}
                            label={
                                <Typography variant="caption" gutterBottom sx={{display: 'block'}}>
                                    Exact match
                                </Typography>
                            }
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="end"
                            control={<Switch checked={formState.quantify} onChange={handleQuantifyChange}
                                             color="secondary"
                                             size="small"/>}
                            label={
                                <Typography variant="caption" gutterBottom sx={{display: 'block'}}>
                                    Quantifier
                                </Typography>
                            }
                            labelPlacement="end"
                        />

                    </FormGroup>
                </FormControl>


                {formState.quantify === true &&
                    <React.Fragment>
                        <HighlightAutocomplete keys={quantifiers}
                                               dict={quantifiersToDescription}
                                               handler={handleQuantifierChange}
                                               label='Quantifier'
                                               variant='outlined'
                                               width={220}
                                               initialSelectedValue={formState.quantifier}
                        />

                        {formState.quantifier?.includes('n') &&
                            <Stack spacing={1} alignItems="center" direction="row">

                                <TextField
                                    placeholder="Enter n"
                                    variant="standard"
                                    color='secondary'
                                    size="small"
                                    multiline
                                    value={formState.n}
                                    focused
                                    onChange={handleNChange}
                                    sx={{width: 95}}
                                />
                                {formState.quantifier?.includes('m') &&
                                    <TextField
                                        placeholder="Enter m"
                                        variant="standard"
                                        color='secondary'
                                        size="small"
                                        multiline
                                        value={formState.m}
                                        focused
                                        onChange={handleMChange}
                                        sx={{width: 95}}
                                    />
                                }
                            </Stack>
                        }
                    </React.Fragment>
                }


                {formState.exactMatch === false &&
                    <React.Fragment>
                        <HighlightAutocomplete keys={regexClasses}
                                               dict={regexClassesToDescription}
                                               handler={handleRegexClassChange}
                                               label='Class'
                                               variant='outlined'
                                               width={220}
                                               initialSelectedValue={formState.regexClass}

                        />

                        {formState.regexClass === 'regex' &&

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon/>}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography variant="caption" gutterBottom
                                                sx={{display: 'block'}}>Regex</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <RegExGroup nestedLevel={`${nestedLevel}${nestedLevel ? ',' : ''}${index}`}
                                                logicalConnector={formState.logicalConnector}
                                                handleLogicalConnectorChange={handleLogicalConnectorChange}/>
                                </AccordionDetails>
                            </Accordion>

                        }
                    </React.Fragment>
                }

                {formState.exactMatch === true && <TextField
                    placeholder="Enter match"
                    variant="standard"
                    color='secondary'
                    size="small"
                    multiline
                    value={formState.match}
                    focused
                    width={220}
                    onChange={handleMatchChange}
                />}


            </Stack>
        </CustomPaper>

    </Box>);
};