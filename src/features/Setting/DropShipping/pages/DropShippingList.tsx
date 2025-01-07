import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Select,
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
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { shallowEqual } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { listCustomer } from 'store/slices/customerSlice';
import { deleteDropShip, listDropShip } from 'store/slices/dropShipSlice';
import { listProduct } from 'store/slices/productSlice';
import { deleteTerminal, listAllTerminal } from 'store/slices/terminalSlice';
import { listVendor } from 'store/slices/vendorSlice';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { DropShipDataType } from 'types/DropShipType';
import DropShipDetailsModal from './DropShippingModel';
import moment from 'moment';

interface Props {
    setEditData?: any;
    toggleForm?: any;
}

const DropShippingList = (props: Props) => {

    const dispatch = useAppDispatch();
    const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();

    // State hooks
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterColumn, setFilterColumn] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [columnSearchQuery, setColumnSearchQuery] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({ VendorsFId: true, DocNumber: true, OrderDateTime: true, BOL: true, TerminalsFId: true, CustomersFId: true, DeliveryDateTime: true });
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDropShipData, setSelectedDropShipData] = useState<DropShipDataType | null>(null);

    const handleClickRow = (item: DropShipDataType) => {
        const updatedItem = {
            ...item,
            DSOFId: item.Id, // Change ID to DFOID
        };
        // delete updatedItem.Id; // Remove the original ID

        setSelectedDropShipData(updatedItem);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const [listAllDropShip, listDropShipLoading] = useAppSelector(
        (state) => [
            state.dropShipReducers.dropShipList,
            state.dropShipReducers.listDropShipLoading
        ],
        shallowEqual
    );

    useEffect(() => {
        dispatch(listDropShip());
        dispatch(listAllTerminal());
        dispatch(listCustomer());
        dispatch(listVendor());

    }, []);

    const [vendorList, listVendorLoading] = useAppSelector(
        (state) => [
            state.vendorReducers.vendorList,
            state.vendorReducers.listVendorLoading
        ],
        shallowEqual
    );


    const [terminalList, terminalListLoading] = useAppSelector(
        (state) => [
            state.terminalReducers.terminalListData,
            state.terminalReducers.listTerminalLoading
        ],
        shallowEqual
    );


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
    const findVendorName = (vendorId: any) => {
        const vendor = vendorList.find(item => item.Id === vendorId);
        return vendor ? vendor.DisplayName : '';
    };
    const findTerminalName = (terminalId: any) => {
        const terminal = terminalList.find(item => item.Id === terminalId);
        return terminal ? terminal.Name : '';
    };

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when searching
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

    // Filtered and sorted data
    const filteredTerminalListData = listAllDropShip.filter(item =>
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

    const sortedData = sortData(filteredTerminalListData, getComparator(order, orderBy));

    const csvHeaders = [
        { label: "VendorsFId", key: "VendorsFId" },
        { label: "DocNumber", key: "DocNumber" },
        { label: "OrderDateTime", key: "OrderDateTime" },
        { label: "BOL", key: "BOL" },
        { label: "TerminalsFId", key: "TerminalsFId" },
        { label: "CustomersFId", key: "CustomersFId" },
        { label: "DeliveryDateTime", key: "NetQuantity" },

    ];

    const csvData = listAllDropShip.map(item => ({
        VendorsFId: item.VendorsFId,
        DocNumber: item.DocNumber,
        OrderDateTime: item.OrderDateTime,
        BOL: item.BOL,
        TerminalsFId: item.TerminalsFId,
        CustomersFId: item.CustomersFId,
        DeliveryDateTime: item.DeliveryDateTime


    }));

    const componentRef = useRef<HTMLTableElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const columnOptions = [
        { name: "VendorsFId", key: "VendorsFId" },
        { name: 'DocNumber', key: 'DocNumber' },
        { name: "OrderDateTime", key: "OrderDateTime" },
        { name: "BOL", key: "BOL" },
        { name: "DeliveryDateTime", key: "DeliveryDateTime" },
        { name: "TerminalsFId", key: "TerminalsFId" },
        { name: "CustomersFId", key: "CustomersFId" },

    ];

    const filteredColumns = columnOptions.filter(column =>
        column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
    );


    const deleteTerminals = async () => {
        try {
            const action = await dispatch(deleteDropShip({ dropShip_id: editId }));
            const response = action.payload;
            console.log({ response })
            props.setEditData(null);
            resetDeleteData(); // Reset delete confirmation state
            toast.success(response.message.message);
            console.log({ response })
            if (response.message.code === "SUCCESS") {
                await dispatch(listDropShip());
                // toast.success("Data deleted successfully");
            } else {
                toast.error("Failed to delete data");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };


    // if (listAllDropShip) {
    //     return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /> </div>
    // }

    return (
        <>
            {/* {listAllDropShip ? (
                <div className='' style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}>
                    No Data available
                </div>
            ) : ( */}
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
                                <CSVLink data={csvData} headers={csvHeaders} filename="DropShiplist.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                                            <MenuItem value="VendorsFId">Vendors</MenuItem>
                                            <MenuItem value="DocNumber">DocNumber</MenuItem>
                                            <MenuItem value="OrderDateTime">OrderDateTime</MenuItem>
                                            <MenuItem value="BOL">BOL</MenuItem>
                                            <MenuItem value="TerminalsFId">Terminals</MenuItem>
                                            <MenuItem value="CustomersFId">Customers</MenuItem>
                                            <MenuItem value="DeliveryDateTime">DeliveryDateTime</MenuItem>
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
                            <TableCell>SN</TableCell>
                            {visibleColumns.VendorsFId && (
                                <TableCell sortDirection={orderBy === 'VendorsFId' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('VendorsFId')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Supplier Name
                                            {orderBy === 'VendorsFId' ? (
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
                            {visibleColumns.DocNumber && (
                                <TableCell sortDirection={orderBy === 'DocNumber' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('DocNumber')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            DocNumber
                                            {orderBy === 'DocNumber' ? (
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
                            {visibleColumns.TerminalsFId && (
                                <TableCell sortDirection={orderBy === 'TerminalsFId' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('TerminalsFId')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Terminals Name
                                            {orderBy === 'TerminalsFId' ? (
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
                            {visibleColumns.OrderDateTime && (
                                <TableCell sortDirection={orderBy === 'OrderDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('OrderDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Schedule Date
                                            {orderBy === 'OrderDateTime' ? (
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
                            {visibleColumns.BOL && (
                                <TableCell sortDirection={orderBy === 'BOL' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('BOL')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            BOL
                                            {orderBy === 'BOL' ? (
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

                            {visibleColumns.DeliveryDateTime && (
                                <TableCell sortDirection={orderBy === 'DeliveryDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('DeliveryDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Dead Line Date
                                            {orderBy === 'DeliveryDateTime' ? (
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
                            <TableCell sx={{ width: '15%' }} className="no-print">Action</TableCell>
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
                                        {visibleColumns.VendorsFId && <TableCell>{findVendorName(item.VendorsFId)}</TableCell>}
                                        {visibleColumns.DocNumber && <TableCell>DO-{item.DocNumber}</TableCell>}
                                        {visibleColumns.TerminalsFId && <TableCell>{findTerminalName(item.TerminalsFId)}</TableCell>}

                                        {visibleColumns.OrderDateTime && <TableCell>{moment(item.OrderDateTime).format('MM/DD/YYYY hh:mm A')}</TableCell>}
                                        {visibleColumns.BOL && <TableCell>{item.BOL}</TableCell>}
                                        {visibleColumns.DeliveryDateTime && <TableCell>{moment(item.DeliveryDateTime).format('MM/DD/YYYY hh:mm A')}</TableCell>}
                                        <TableCell className="no-print" sx={{ minWidth: '30px' }}>
                                            <ListItemIcon sx={{ minWidth: '30px' }}
                                                onClick={() => {
                                                    props.setEditData(item);
                                                    props.toggleForm();
                                                }}>
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <ModeEditOutlineIcon sx={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </ListItemIcon>

                                            <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => handleDeleteClick(item.Id)} className='demooooooooooooo'>
                                                <Tooltip title="Delete" placement="top" arrow>
                                                    <DeleteOutlineIcon sx={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemIcon onClick={() => handleClickRow(item)}>
                                                <Tooltip title="View Details" placement="top" arrow>
                                                    <BrowserUpdatedIcon sx={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* )} */}

            <DropShipDetailsModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                toggle={handleCloseModal}
                dropShipData={selectedDropShipData}
            />
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
                handleModal={toggleModal}
                handleConfirmClick={deleteTerminals}
            />
        </>
    )
}

export default DropShippingList;