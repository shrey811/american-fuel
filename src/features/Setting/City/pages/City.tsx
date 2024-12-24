import React, { useEffect, useState } from 'react';
import {
    IconButton,
    ListItemIcon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import { deleteCity, listCity } from 'store/slices/citySlice';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
    setEditData?: any;
    toggleForm?: any;
}

const CityList = (props: Props) => {

    const { editId, modal, toggleModal, handleDeleteClick, resetDeleteData } = useDeleteConfirmation();

    const dispatch = useAppDispatch();

    const [cityList, listCityLoading] = useAppSelector(
        (state) => [
            state.cityReducers.cityList,
            state.cityReducers.listCityLoading,
        ],
        shallowEqual
    );

    useEffect(() => {
        dispatch(listCity());
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleDeleteCities = async () => {
        try {
            const action = await dispatch(deleteCity({ city_id: editId }));
            const response = action.payload;
            toggleModal();
            resetDeleteData();
            console.log({ response })
            if (response.message.code === 'SUCCESS') {
                dispatch(listCity())
            }
            toast.success('City deleted successfully');
        } catch (error) {
            console.log(error);
        }
    };

    if (listCityLoading) {
        return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /></div>;
    }

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when searching
    };

    const filteredCityListData = cityList.filter(item =>
        Object.values(item).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <>
            <TableContainer component={Paper}>
                <TextField
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    margin="dense"
                    sx={{ m: 1 }}
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <IconButton size="small">
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow sx={{ background: '#EFEFEF' }}>
                            <TableCell>SN</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell sx={{ width: '15%' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCityListData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCityListData
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((item, index) => (
                                    <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.StateName}</TableCell>
                                        <TableCell>{item.Name}</TableCell>
                                        <TableCell>
                                            <ListItemIcon sx={{ minWidth: '30px' }}
                                                onClick={() => {
                                                    props.setEditData(item)
                                                    props.toggleForm();
                                                }}>
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <ModeEditOutlineIcon sx={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemIcon onClick={() => handleDeleteClick(item.Id)}>
                                                <Tooltip title="Delete" placement="top" arrow>
                                                    <DeleteOutlineIcon sx={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 35, 45]}
                component="div"
                count={cityList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ConfirmationModal
                open={modal}
                handleModal={toggleModal}
                handleConfirmClick={() => handleDeleteCities()}
            />
        </>
    )
}

export default CityList;