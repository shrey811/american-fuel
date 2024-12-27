import { Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import Button from 'components/Button/Button';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { deleteCustomerAssest, listCustomerAssest } from 'store/slices/customerassestsSlice';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { CSVLink } from 'react-csv';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { tableListItemStyles } from './styles';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CustomerAssestForm from './CustomerAssestForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

interface Props {
    fetchCustomer: any;
    // setEditData?: any
    // toggleForm: () => void;
}

const tesStyle = (theme: any) => ({
    fontSize: theme.customTable.fontSize.sm

})

const CustomerAssestList = (props: Props) => {
    const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterColumn, setFilterColumn] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [columnSearchQuery, setColumnSearchQuery] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
        Name: true, UniqueId: true, AssetType: true,
        Status: true, AssetCategory: true, AssetModel: true,
    });
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [editData, setEditData] = useState(null);

    const dispatch = useAppDispatch();

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when searching
    };
    useEffect(() => {
        const customerAssest_id = props.fetchCustomer.Id;
        dispatch(listCustomerAssest(customerAssest_id));
    }, []);

    const [customerAssestList, listCustomerAssestLoading] = useAppSelector(
        (state) => [
            state.customerAssestReducers.customerAssestList,
            state.customerAssestReducers.listCustomerAssestLoading,
        ],
        shallowEqual
    );

    console.log("fetchCustomer: any;", props.fetchCustomer);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleFilterColumnChange = (event: any) => {
        setFilterColumn(event.target.value);
    };

    const handleColumnVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVisibleColumns({
            ...visibleColumns,
            [event.target.name]: event.target.checked,
        });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExportOpen = (event: React.MouseEvent<HTMLElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const [customerList, listcustomerLoading] = useAppSelector(
        (state) => [
            state.customerReducers.customerList,
            state.customerReducers.listcustomerLoading
        ],
        shallowEqual
    );

    const findCustomerName = (customerId: any) => {
        const customer = customerList.find(item => item.Id === customerId);
        return customer ? customer.DisplayName : '';
    };


    // Filtered and sorted data
    const filteredcustomerAssestListData = customerAssestList.filter(item =>
        Object.entries(item).some(([key, value]) =>
            (filterColumn ? key === filterColumn : true) &&
            (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    const sortData = (array: any[], comparator: (a: any, b: any) => number) => {
        const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
        return order === 'desc'
            ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
    };

    const sortedData = sortData(filteredcustomerAssestListData, getComparator(order, orderBy));

    const csvHeaders = [
        { label: "Name", key: "FirstName" },
        { label: "UniqueId", key: "UniqueId" },
        { label: "AssetType", key: "AssetType" },
        { label: "Status", key: "Status" },
        // { label: "CustomersFId", key: "CustomersFId" },
        { label: "AssetCategory", key: "AssetCategory" },
        { label: "AssetModel", key: "AssetModel" },
    ];

    const csvData = customerAssestList.map(item => ({
        Name: item.Name,
        UniqueId: item.UniqueId,
        AssetType: item.AssetType,
        Status: item.Status,
        // CustomersFId: item.CustomersFId,
        AssetCategory: item.AssetCategory,
        AssetModel: item.AssetModel,
    }));

    const componentRef = useRef<HTMLTableElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const columnOptions = [
        { name: "Name", key: "FirstName" },
        { name: "UniqueId", key: "UniqueId" },
        { name: "AssetType", key: "AssetType" },
        { name: "Status", key: "Status" },
        // { name: "CustomersFId", key: "CustomersFId" },
        { name: "AssetCategory", key: "AssetCategory" },
        { name: "AssetModel", key: "AssetModel" },
    ];

    const filteredColumns = columnOptions.filter(column =>
        column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
    );

    const [isFormOpen, setIsFormOpen] = useState(false); // State to toggle form visibility

    const handleOpenForm = () => {
        setIsFormOpen(true); // Open the form
    };

    const handleCloseForm = () => {
        setIsFormOpen(false); // Close the form
        setEditData(null);
    };
    const handleEditClick = (item: any) => {
        setEditData(item); // Set the selected asset
        handleOpenForm(); // Open the form
    };

    const deleteCustomers = async (item: any) => {
        try {
            const Id = editId;
            // console.log('ID', editId);

            const action = await dispatch(deleteCustomerAssest(Id));
            const response = action.payload;
            toast.success("Data deleted successfully");
            // props.setEditData(null);
            resetDeleteData(); // Reset delete confirmation state
            console.log({ response });
            if (response.message.code === "SUCCESS") {
                const customerAssest_id = props.fetchCustomer.Id;
                await dispatch(listCustomerAssest(customerAssest_id));
            }
        } catch (error) {
            toast.error("Error");
            // Handle error
        }
    }

    if (listCustomerAssestLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /> </div>
    }
    return (
        <>
            {!isFormOpen && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2>Customer Assets</h2>
                        <Button variant="contained" color="primary" onClick={handleOpenForm}>
                            Add Customer Asset
                        </Button>
                    </div>
                    {/* Render CustomerAssestList Table */}
                    {/* The existing table code goes here */}
                    <TableContainer component={Paper}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                            <div className="filterColumn">
                                <Button
                                    variant="outlined"
                                    startIcon={<ViewColumnIcon />}
                                    onClick={handleMenuOpen}
                                    sx={{ marginRight: '16px' }}
                                >
                                    Columns
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <TextField
                                        value={columnSearchQuery}
                                        onChange={(e) => setColumnSearchQuery(e.target.value)}
                                        variant="outlined"
                                        margin="dense"
                                        size='small'
                                        placeholder="Search Columns..."
                                        InputProps={{
                                            startAdornment: (
                                                <IconButton size="small">
                                                    <SearchIcon />
                                                </IconButton>
                                            ),
                                        }}
                                        sx={{ margin: '10px' }}
                                    />
                                    <FormGroup sx={{ padding: '8px' }}>
                                        {filteredColumns.map((column) => (
                                            <FormControlLabel
                                                key={column.key}
                                                control={
                                                    <Checkbox
                                                        checked={visibleColumns[column.key]}
                                                        onChange={handleColumnVisibilityChange}
                                                        name={column.key}
                                                    />
                                                }
                                                label={column.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </Menu>

                                <Button
                                    variant="outlined"
                                    startIcon={<SystemUpdateAltIcon />}
                                    onClick={handleExportOpen}
                                    sx={{ marginRight: '16px' }}
                                >
                                    Export
                                </Button>
                                <Menu
                                    anchorEl={exportAnchorEl}
                                    open={Boolean(exportAnchorEl)}
                                    onClose={handleExportClose}
                                >
                                    <MenuItem onClick={handlePrint} sx={{ display: 'flex' }}>
                                        <PrintIcon />
                                        &nbsp; Print
                                    </MenuItem>
                                    <MenuItem>
                                        <CSVLink data={csvData} headers={csvHeaders} filename="Vendorlist.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
                                            <DownloadIcon />
                                            &nbsp; Download CSV
                                        </CSVLink>
                                    </MenuItem>
                                </Menu>

                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    onClick={handleFilterOpen}
                                    sx={{ marginRight: '16px' }}
                                >
                                    Filter By
                                </Button>
                                <Menu
                                    anchorEl={filterAnchorEl}
                                    open={Boolean(filterAnchorEl)}
                                    onClose={handleFilterClose}
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <div className="filterMenu__column">
                                        <MenuItem>
                                            <FormControl variant="outlined" size="small" margin="dense" sx={{ minWidth: 120, marginRight: '16px' }}>
                                                <InputLabel>Columns</InputLabel>
                                                <Select
                                                    value={filterColumn}
                                                    onChange={handleFilterColumnChange}
                                                    label="Filter by"
                                                    variant='standard'
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="Name">Name</MenuItem>
                                                    <MenuItem value="UniqueId">UniqueId</MenuItem>
                                                    <MenuItem value="AssetType">AssetType</MenuItem>
                                                    <MenuItem value="Status">Status</MenuItem>
                                                    <MenuItem value="CustomersFId">CustomersFId</MenuItem>
                                                    <MenuItem value="AssetCategory">AssetCategory</MenuItem>
                                                    <MenuItem value="AssetModel">AssetModel</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </MenuItem>
                                        <MenuItem>
                                            <TextField
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                variant="standard"
                                                margin="dense"
                                                size='small'
                                                placeholder="Value"
                                                sx={{ marginRight: '16px', marginTop: '0px' }}
                                            />
                                        </MenuItem>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" ref={componentRef}>
                            <TableHead>
                                <TableRow sx={{ background: '#EFEFEF' }}>
                                    <TableCell sx={tesStyle}>SN</TableCell>
                                    {visibleColumns.Name && (
                                        <TableCell sortDirection={orderBy === 'Name' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('Name')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    Name
                                                    {orderBy === 'Name' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {visibleColumns.UniqueId && (
                                        <TableCell sortDirection={orderBy === 'UniqueId' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('UniqueId')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    UniqueId
                                                    {orderBy === 'UniqueId' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {visibleColumns.AssetType && (
                                        <TableCell sortDirection={orderBy === 'AssetType' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('AssetType')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    AssetType
                                                    {orderBy === 'AssetType' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {visibleColumns.Status && (
                                        <TableCell sortDirection={orderBy === 'Status' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('Status')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    Status
                                                    {orderBy === 'Status' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {/* {visibleColumns.CustomersFId && (
                                        <TableCell sortDirection={orderBy === 'CustomersFId' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('CustomersFId')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    Customers Name
                                                    {orderBy === 'CustomersFId' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )} */}

                                    {visibleColumns.AssetCategory && (
                                        <TableCell sortDirection={orderBy === 'AssetCategory' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('AssetCategory')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    AssetCategory
                                                    {orderBy === 'AssetCategory' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {visibleColumns.AssetModel && (
                                        <TableCell sortDirection={orderBy === 'AssetModel' ? order : false}>
                                            <Tooltip title="Sort" placement="top" arrow>
                                                <span
                                                    onClick={() => handleRequestSort('AssetModel')}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    AssetModel
                                                    {orderBy === 'AssetModel' ? (
                                                        order === 'asc' ? (
                                                            <ExpandLessIcon fontSize="small" />
                                                        ) : (
                                                            <ExpandMoreIcon fontSize="small" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    <TableCell className='no-print'>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item, index) => (
                                            <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                                                <TableCell>{index + 1}</TableCell>
                                                {visibleColumns.Name && <TableCell>{item.Name}</TableCell>}
                                                {visibleColumns.UniqueId && <TableCell>{item.UniqueId}</TableCell>}
                                                {visibleColumns.AssetType && <TableCell>{item.AssetType}</TableCell>}
                                                {visibleColumns.Status && <TableCell>{item.Status}</TableCell>}
                                                {/* {visibleColumns.CustomersFId && <TableCell>{item.CustomersFId}</TableCell>} */}
                                                {visibleColumns.AssetCategory && <TableCell>{item.AssetCategory}</TableCell>}
                                                {visibleColumns.AssetModel && <TableCell>{item.AssetModel}</TableCell>}
                                                <TableCell className='no-print'>
                                                    <ListItemIcon sx={tableListItemStyles} onClick={() => handleEditClick(item)} >
                                                        <Tooltip title="Edit" placement="top" arrow>
                                                            <ModeEditOutlineIcon sx={{ cursor: 'pointer', marginRight: 1 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemIcon sx={{ minWidth: '24px' }}>
                                                        <Tooltip title="Delete" placement="top" arrow>
                                                            <DeleteOutlineIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleDeleteClick(item.Id)} />
                                                        </Tooltip>
                                                    </ListItemIcon>

                                                </TableCell>
                                            </TableRow>
                                        )))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 35, 45]}
                        component="div"
                        count={sortedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <ConfirmationModal
                        open={modal}
                        handleModal={() => toggleModal()}
                        handleConfirmClick={() => deleteCustomers(editId)}
                    />
                </>
            )}

            {/* Form Section */}
            {isFormOpen && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>

                        <IconButton color="secondary" onClick={handleCloseForm}>
                            <ArrowBackIcon style={{ color: "black" }} />
                        </IconButton>

                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <CustomerAssestForm
                            onClose={handleCloseForm}
                            fetchCustomer={props.fetchCustomer}
                            editData={editData}
                        />
                    </div>
                </>
            )}


        </>
    )
}

export default CustomerAssestList