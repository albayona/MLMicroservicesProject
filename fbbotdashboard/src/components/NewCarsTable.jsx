import * as React from "react";
import {CarTable} from "./CarTable";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";


export default function NewCarsTable({groupStateDispatch, carValues}) {

    return (
        <Box sx={{width: 'auto'}}>
                {<CarTable type="New" cars={carValues} dispatch={groupStateDispatch}
                           pagination={false}/>}
        </Box>
    );
}



