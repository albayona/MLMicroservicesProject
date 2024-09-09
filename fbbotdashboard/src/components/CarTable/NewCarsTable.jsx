import * as React from "react";
import Box from "@mui/material/Box";
import PaginatedCarTable from "./PaginatedCarTable";


export default function NewCarsTable({
                                         carValues,
                                         acumGroupValues,
                                         acumGroupIndex,
                                         addSubscriberToUpdate,
                                         setQueryParams,
                                         isLoading
                                     }) {


    return (<Box sx={{width: 'auto'}}>
        {<PaginatedCarTable type="New"
                            setQueryParams={setQueryParams}
                            carsPage={carValues}
                            isLoading={isLoading}
                            addSubscriberToUpdate={addSubscriberToUpdate}
                            acumGroupValues={acumGroupValues}
                            acumGroupIndex={acumGroupIndex}
        />}
    </Box>);
}



