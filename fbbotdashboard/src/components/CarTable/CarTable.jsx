import * as React from 'react';
import {memo, useMemo, useState} from 'react';
import Box from '@mui/material/Box';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {DataGrid, GridActionsCellItem, GridToolbar,} from '@mui/x-data-grid';
import {CONTENT_HOST, useFetchContentAPI} from "../../hooks/UseFetch";
import {Button, Modal} from "@mui/material";
import {useAuth} from "../../contexts/UserContext";
import {CarDetail} from "./CarDetail";
import {orderedAcumValues, parseDate} from "../../utils/utils.py";

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
    return oldProps.isLoading === newProps.isLoading &&
        oldProps.paginationSortFilterModel.page === newProps.paginationSortFilterModel.page &&
        oldProps.paginationSortFilterModel.pageSize === newProps.paginationSortFilterModel.pageSize &&
        oldProps.paginationSortFilterModel?.sortField === newProps.paginationSortFilterModel?.sortField &&
        oldProps.paginationSortFilterModel?.sort === newProps.paginationSortFilterModel?.sort &&
        oldProps.paginationSortFilterModel?.filterField === newProps.paginationSortFilterModel?.filterField &&
        oldProps.paginationSortFilterModel?.filterOperator === newProps.paginationSortFilterModel?.filterOperator &&
        oldProps.paginationSortFilterModel?.filterValue === newProps.paginationSortFilterModel?.filterValue &&
        oldProps.carsPage?.results?.length === newProps.carsPage?.results?.length &&
        oldProps.carsPage?.results?.every((oldVal, index) => {
            const newVal = newProps.carsPage?.results[index];
            return oldVal.id === newVal.id;
        })
}


const endpointsByAction = {
    0: '/like/',
    1: '/unlike/',
    2: '/see/',
    3: '/unsee/',
    4: '/info/',
    6: '/empty-fav/',
    7: '/mark-all-seen/',
    8: 'None',
};

export const CarTable = memo(({
                                  carsPage,
                                  type,
                                  setUpdateArchiveTrigger,
                                  addSubscriberToUpdate,
                                  acumGroupValues,
                                  acumGroupIndex,
                                  paginationSortFilterModel,
                                  rowCount,
                                  isLoading,
                                  handleSortModelChange,
                                  handlePaginationModelChange,
                                  handleFilterModelChange

                              }) => {

    const [selectedCar, setSelectedCar] = useState({});
    const [action, setAction] = useState({trigger: false, index: 8, id: ""});

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {token} = useAuth();
    const {user} = useAuth();

    const paginationModel = useMemo(
        () => ({page: paginationSortFilterModel.page, pageSize: paginationSortFilterModel.pageSize}),
        [paginationSortFilterModel.page, paginationSortFilterModel.pageSize]
    );


    const requestUpdate = () => {
        if (type === "New") {
            const subscriber = (acumGroupIndex.length === 0) ? 'root' : orderedAcumValues(acumGroupValues, acumGroupIndex).join('XX');
            addSubscriberToUpdate(subscriber);
        } else {
            if (action.index === 3) {
                const carAction = carsPage.results.find(car => car.id === action.id);
                addSubscriberToUpdate(`${carAction.brand}XX${carAction.price_range}XX${carAction.miles_range}XX${carAction.year}`);
            }
            setUpdateArchiveTrigger(true);
        }
    }

    const tableActionRequest = {
        triggerRequest: action.trigger, callback: () => {
            requestUpdate();
            setAction({trigger: false, index: 8, id: ""});
        }, method: 'PUT', headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Consumer-Custom-Id': user,
        }, endpoint: `${CONTENT_HOST}${endpointsByAction[action.index]}${action.id}`, payload: null,
    }

    const [error] = useFetchContentAPI(tableActionRequest);


    const handleLikeClick = (id) => () => {
        setAction({trigger: true, index: 0, id: id});
    };


    const handleDislikeClick = (id) => () => {
        setAction({trigger: true, index: 1, id: id});
    };

    const handleArchiveClick = (id) => () => {
        setAction({trigger: true, index: 2, id: id});
    };

    const handleUnarchiveClick = (id) => () => {
        setAction({trigger: true, index: 3, id: id});
    };

    const handleInfoClick = (id) => () => {
        setSelectedCar(carsPage.results.find(car => car.id === id));
        handleOpen();
    };

    const processRowUpdate = (newRow) => {
        // const updatedRow = {...newRow, isNew: false};
        // setCars(cars.map((row) => (row.id === newRow.id ? updatedRow : row)));
        // return updatedRow;
    };

    function emptyFavorites() {
        setAction({trigger: true, index: 6, id: ""});
    }

    function archiveAll() {
        setAction({trigger: true, index: 7, id: ""});
    }

    const emptyFavsButton = (type === 'Favs') ?
        <Button onClick={emptyFavorites} variant="contained" color='secondary'>Empty favorites</Button> : null;

    const archiveAllButton = (type === 'New' && acumGroupIndex.length === 0) ?
        <Button onClick={archiveAll} variant="contained" color='secondary'>Archive all</Button> : null;


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

            height: 'auto', width: 'auto', '& .actions': {
                color: 'text.secondary',
            }, '& .textPrimary': {
                color: 'text.primary',
            }, overflowX: 'auto',
        }}
    >
        {emptyFavsButton}
        {archiveAllButton}
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
            autoHeight
            rows={parseDate(carsPage?.results)}
            columns={columns}
            editMode="row"
            paginationMode="server"
            processRowUpdate={processRowUpdate}
            slots={{
                toolbar: GridToolbar,
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationModel={paginationModel}
            loading={isLoading}
            rowCount={rowCount}
            onSortModelChange={handleSortModelChange}
            onFilterModelChange={handleFilterModelChange}
            onPaginationModelChange={handlePaginationModelChange}
        />
    </Box>);
}, areCarTablePropsEqual);
