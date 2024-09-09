import {createTheme} from "@mui/material/styles";

export const CustomThemeOptions = createTheme({
    palette: {
        mode: 'light',
        secondary: {
            main: '#b75b82',
            light: '#d0cacb',
            contrastText: '#fff',
        },
        primary: {
            main: '#3f51b5',
            light: '#f1f3f6',
            contrastText: '#fff',
        },

        error: {
            main: '#f44336',
        },
        action: {
            active: '#3f51b5',
            hover: '#f3c7d6',
            selected: '#f3c7d6',
            disabled: '#c7cce3',
            disabledBackground: '#f3c7d6',
            focus: '#f3c7d6',
            hoverOpacity: 0.08,
            selectedOpacity: 0.08,
            disabledOpacity: 0.38,
            focusOpacity: 0.12,
        },
        text: {
            primary: '#2c2e36',
            secondary: '#85777c',
            disabled: '#c7cce3',
            hint: '#c7cce3',
        },
    },

    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});