import * as React from 'react';
import {memo, useState} from 'react';
import Box from '@mui/material/Box';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {DataGrid, GridActionsCellItem, GridToolbar,} from '@mui/x-data-grid';
import {CONTENT_HOST, useFetchContentAPI} from "../hooks/UseFetch";
import {Button, Modal} from "@mui/material";
import {useAuth} from "../contexts/UserContext";
import {CarDetail} from "./CarDetail";

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


function areCarTablePropsEqual(oldProps, newProps) {
    return oldProps.cars.length === newProps.cars.length &&
        oldProps.cars.every((oldVal, index) => {
            const newVal = newProps.cars[index];
            return oldVal.id === newVal.id;
        })
}

export const CarTable = memo(({cars, type, dispatch, setOldActionTrigger, pagination})  =>{
    console.log("CarTable", cars, type);

    const [selectedCar, setSelectedCar] = useState({});
    const [actionEndpoint, setActionEndpoint] = useState('');
    const [actionTrigger, setActionTrigger] = useState(false);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {token} = useAuth();
    const {user} = useAuth();
    const height = (pagination) ? '600px' : 'auto';


    const tableActionRequest = {
        triggerRequest: actionTrigger,
        callback: () => {
            setActionTrigger(false)

            if (type === "New") {
                dispatch({type: 'requestUpdate'});
            } else {
                setOldActionTrigger(true);
            }

        },
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Consumer-Custom-Id': user,
        },
        endpoint: actionEndpoint,
        payload: null,
    }

    const [error] = useFetchContentAPI(tableActionRequest);


    const handleLikeClick = (id) => () => {
        setActionEndpoint(`${CONTENT_HOST}/like/` + id);
        setActionTrigger(true);
    };


    const handleDislikeClick = (id) => () => {
        setActionEndpoint(`${CONTENT_HOST}/unlike/` + id);
        setActionTrigger(true);
    };

    const handleArchiveClick = (id) => () => {
        setActionEndpoint(`${CONTENT_HOST}/see/` + id);
        setActionTrigger(true);
    };

    const handleUnarchiveClick = (id) => () => {
        setActionEndpoint(`${CONTENT_HOST}/unsee/` + id);
        setActionTrigger(true);
    };

    const handleInfoClick = (id) => () => {
        setSelectedCar(cars.find(car => car.id === id));
        handleOpen();
    };

    const processRowUpdate = (newRow) => {
        // const updatedRow = {...newRow, isNew: false};
        // setCars(cars.map((row) => (row.id === newRow.id ? updatedRow : row)));
        // return updatedRow;
    };

    function emptyFavorites() {
        setActionEndpoint(`${CONTENT_HOST}/empty-fav/`);
        setActionTrigger(true);
    }

    const emptyFavsButton = (type === 'Favs') ?
        <Button onClick={emptyFavorites} variant="contained" color='secondary'>Empty favorites</Button> : null;


    const actionsByType = (id) => {

        if (type === "New") {
            return [<GridActionsCellItem
                icon={<InfoOutlinedIcon/>}
                label="Info"
                onClick={handleInfoClick(id)}
                color="primary"

            />, <GridActionsCellItem
                icon={<FavoriteIcon/>}
                label="Like"
                onClick={handleLikeClick(id)}
                color="secondary"
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
                color="primary"

            />, <GridActionsCellItem
                icon={<FavoriteIcon/>}
                label="Like"
                onClick={handleLikeClick(id)}
                color="secondary"
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
                color="primary"

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
            height: {height}, width: 'auto', '& .actions': {
                color: 'text.secondary',
            }, '& .textPrimary': {
                color: 'text.primary',
            },
            overflowX: 'auto',
        }}
    >
        {emptyFavsButton}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                {Object.keys(selectedCar).length === 0 ? null : <CarDetail car={selectedCar}></CarDetail>}
            </Box>
        </Modal>

        <DataGrid
            autosizeOnMount
            hideFooterPagination={!pagination}
            hideFooter={!pagination}
            rows={cars}
            columns={columns}
            editMode="row"
            processRowUpdate={processRowUpdate}
            slots={{
                toolbar: GridToolbar,
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
        />
    </Box>);
}, areCarTablePropsEqual);
