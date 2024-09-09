import Box from "@mui/material/Box";
import {Grid, Stack} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";


const Panel = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));v

const FilterPage = () => {
    return (
        <Box

            sx={{
                my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
            }}
        >
            <Stack spacing={2}>
                <Grid container spacing={1} columns={3}>
                    <Grid size={1}>
                        <Panel>size=8</Panel>
                    </Grid>
                    <Grid size={1}>
                        <Panel>size=8</Panel>
                    </Grid>
                    <Grid size={1}>
                        <Panel>size=8</Panel>
                    </Grid>
                </Grid>

            </Stack>


        </Box>

    )
}