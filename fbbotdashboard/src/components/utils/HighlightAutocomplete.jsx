import {Autocomplete, Chip, TextField} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import * as React from "react";
import Box from "@mui/material/Box";

export const HighlightAutocomplete = ({keys, dict, handler, label, icon, variant, width, initialSelectedValue}) => {
    const [selectedValue, setSelectedValue] = React.useState(initialSelectedValue || '');

    return <Autocomplete
        sx={{width: {width}}}
        options={keys}
        getOptionLabel={(option) => dict[option]}
        onChange={(event, newValue) => {
            handler(event, newValue);
            setSelectedValue(newValue);
        }}
        renderInput={(params) => {
            const chipLabel = selectedValue ? <Chip size="small" label={dict[selectedValue]}/> : null;
            const textFieldValue = selectedValue ? '' : params.inputProps.value;
            const customProps = {
                ...params,
                InputProps: {
                    ...params.InputProps,
                    startAdornment: chipLabel
                },
                inputProps: {...params.inputProps, value: textFieldValue}
            };
            return (
                <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                    {icon}
                    <TextField
                        label={label}
                        variant={variant}
                        color='secondary'
                        size="small"
                        {...customProps}
                    />
                </Box>
            );
        }
        }
        renderOption={(props, option, {inputValue}) => {
            const {key, ...optionProps} = props;
            const matches = match(dict[option], inputValue, {insideWords: true});
            const parts = parse(dict[option], matches);

            return (<li key={key} {...optionProps}>
                <div>
                    {parts.map((part, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: part.highlight ? 700 : 400,
                            }}
                        >
                                            {part.text}
                                        </span>))}
                </div>
            </li>);
        }}
    />;
};