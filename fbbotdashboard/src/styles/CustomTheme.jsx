import {createTheme} from "@mui/material/styles";

export const CustomThemeOptions = createTheme({
    palette: {
        mode: 'light',
        secondary: {
            main: '#c3d5ea',
        },
    },

    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});