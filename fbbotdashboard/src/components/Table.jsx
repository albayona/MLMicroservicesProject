import * as React from 'react';
import Box from '@mui/material/Box';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import {
    GridToolbar, DataGrid, GridActionsCellItem,

} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import {
    CONTENT_HOST, SSE_HOST, useFetchCars, useFetchGetCars, useFetchPutCars, useFetchRefreshCars, useFetchRefreshNewCars
} from "../hooks/UseFetch";
import DetailCard from "./Detail";
import {Button, Modal} from "@mui/material";
import {useAuth} from "../conntexts/UserContext";
import {fetchEventSource} from "@microsoft/fetch-event-source";

const modalStyle = {
    position: 'absolute',
    top: '2%',  /* Set left to 50% */
    left: '50%',  /* Set left to 50% */
    width: '75%',  /* Make width 90% of the container */
    transform: 'translateX(-50%)',
    maxHeight: '800px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function FullFeaturedCrudGrid({url, type, group, groupValue, newGroup, setNewGroup}) {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState({});
    const [actionURl, setActionURL] = useState('');

    const [refreshAction, setRefreshAction] = useState(false);

    // console.log("newEvent", newGroup)


    const [actionDone, setActionDone] = useState(false);

    const [isLoading, error] = useFetchCars(url, setCars);

    const [refreshLoading, refreshError] = useFetchRefreshCars(url, cars, setCars, actionDone, setActionDone);


    const [refreshLoading2, refreshError2] = useFetchRefreshNewCars(url, type, cars, setCars, group, groupValue, newGroup, setNewGroup);


    const [putLoading, putError] = useFetchPutCars(actionURl, setActionDone);

    const [getLoading, gettError] = useFetchGetCars(refreshAction, setRefreshAction);


    const [newCars, setNewCars] = useState([]);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {token} = useAuth();
    const {user} = useAuth();

    // useEffect(() => {
    //     if (type !== "New") return
    //
    //     const es = new EventSourcePlus(`${API_HOST}/subscribe/subscribe/user`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': `Bearer ${token}`,
    //         },
    //     });
    //
    //     const controller = es.listen({
    //         onMessage(message) {
    //             console.log(">>>", message);
    //             if (message.startsWith('data')) {
    //                 setActionDone(true);
    //             }
    //         },
    //
    //         onResponse() {
    //             console.log(">>> Connection opened!");
    //         },
    //
    //         onResponseError(e) {
    //             console.log("ERROR!", e);
    //         },
    //
    //     });
    //
    //     // return () => controller.abort();
    //
    // }, []);


    const handleLikeClick = (id) => () => {
        setActionURL(`${CONTENT_HOST}/like/` + id);
    };


    const handleDislikeClick = (id) => () => {
        setActionURL(`${CONTENT_HOST}/unlike/` + id);
    };

    const handleArchiveClick = (id) => () => {
        setActionURL(`${CONTENT_HOST}/see/` + id);
    };

    const handleUnarchiveClick = (id) => () => {
        setActionURL(`${CONTENT_HOST}/unsee/` + id);
    };

    const handleInfoClick = (id) => () => {
        setSelectedCar(cars.find(car => car.id === id));
        console.log(cars.find(car => car.id === id));
        handleOpen();
    };


    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};
        setCars(cars.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    let button = null;
    let button2 = null;


    function emptyFavorites() {
        setActionURL(`${CONTENT_HOST}/empty-fav/`);
    }

    function refresh() {
        setRefreshAction(true);
    }




    if (type === "Favs") {
        button = <Button onClick={emptyFavorites} variant="contained">Empty favorites</Button>
    }

    function isCarNewById(carId) {
        // Find the car object with the matching ID
        const car = cars.find(car => car.id === carId);

        // Check if the car exists and has the 'new' property set to true
        if (car && car.new === true) {
            return true;
        } else {
            return false;
        }
    }

    const actionsByType = (id) => {

        if (type === "New") {
            return [<GridActionsCellItem
                icon={<InfoOutlinedIcon/>}
                label="Info"
                onClick={handleInfoClick(id)}
                color="inherit"

            />, <GridActionsCellItem
                icon={<FavoriteIcon/>}
                label="Like"
                className="textPrimary"
                onClick={handleLikeClick(id)}
                color="inherit"
            />, <GridActionsCellItem
                icon={<VisibilityOffIcon/>}
                label="Archive"
                onClick={handleArchiveClick(id)}
                color="inherit"
                disabled={type === "Old"}
            />];
        } else if (type === "Old") {
            return [<GridActionsCellItem
                icon={<InfoOutlinedIcon/>}
                label="Info"
                onClick={handleInfoClick(id)}
                color="inherit"

            />, <GridActionsCellItem
                icon={<FavoriteIcon/>}
                label="Like"
                className="textPrimary"
                onClick={handleLikeClick(id)}
                color="inherit"
            />, <GridActionsCellItem
                icon={<VisibilityIcon/>}
                label="Unarchive"
                onClick={handleUnarchiveClick(id)}
                color="inherit"
                disabled={type === "New"}
            />];
        } else {
            return [<GridActionsCellItem
                icon={<InfoOutlinedIcon/>}
                label="Info"
                onClick={handleInfoClick(id)}
                color="inherit"

            />, <GridActionsCellItem
                icon={<ThumbDownIcon/>}
                label="Dislike"
                onClick={handleDislikeClick(id)}
                color="inherit"
            />,];
        }
    }

    const columns = [

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({id}) => {
                return actionsByType(id);
            },
        },

        {
            field: 'score', headerName: 'Score', type: 'number', width: 60, editable: true,
        }, {
            field: 'price', headerName: 'Price', type: 'number', width: 60, editable: true,
        },

        {
            field: 'miles', headerName: 'Miles', type: 'number', width: 100, editable: true,
        },

        {
            field: 'year', headerName: 'Year', type: 'number', width: 60, editable: true,
        }, {
            field: 'model', headerName: 'Model', width: 150, editable: true,
        },

        {
            field: 'date', headerName: 'Date', type: 'date', width: 100, editable: true,
        },

        {
            field: 'place', headerName: 'Place', width: 120, editable: true,
        },


        {
            field: 'description', headerName: 'Description', width: 200, editable: true,
        },


    ];

    return (<Box
            sx={{
                height: 'auto', width: '100%', '& .actions': {
                    color: 'text.secondary',
                }, '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            {button}
            {button2}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    {Object.keys(selectedCar).length === 0 ? null : <DetailCard car={selectedCar}></DetailCard>}
                </Box>
            </Modal>



            <DataGrid
                hideFooterPagination={true}
                hideFooter={true}
                rows={cars}
                columns={columns}
                editMode="row"
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </Box>);
}