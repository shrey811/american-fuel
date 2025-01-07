import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Modal, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import Button from 'components/Button/Button';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { useReactToPrint } from 'react-to-print';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { tableListItemStyles } from './styles';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GeneralModal from 'components/UI/GeneralModal';

import { deleteSalesOrder, listSalesOrder } from 'store/slices/salesOrderSlice';
import { listCustomer } from 'store/slices/customerSlice';
import SalesOrderInvoice from './SalesOrderInvoice';
import moment from 'moment';
import { getBillAddressCustomer } from 'store/slices/billaddressSlice';
import { getBillToAddresses } from 'store/slices/addressesSlice';
import { getShipToAddresses } from 'store/slices/shipToAddressesSlice';
import SalesOrderDeliveryTicket from './SalesOrderDeliveryTicket';
import SummarizeIcon from '@mui/icons-material/Summarize';
interface Props {
    setEditData?: any
    toggleForm: () => void;
    onSelectId: (id: number[]) => void;
}

interface Charge {
    Id: number;
    // Add other properties if necessary
}


const tesStyle = (theme: any) => ({
    fontSize: theme.customTable.fontSize.sm
})

const SalesOrderList = (props: Props) => {
    const dispatch = useAppDispatch();
    const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [columnSearchQuery, setColumnSearchQuery] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
        InvoiceStatus: true, DeliveryStatus: true, OrderDateTime: true,
        ExpectedDateTime: true, SOStatus: true, TotalAmt: true, CustomersFId: true, DocNumber: true,
    });

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [filterColumn, setFilterColumn] = useState('');
    const [invoiceData, setInvoiceData] = useState<any>(null); // State to hold invoice data for review
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    // console.log({ invoiceData });

    useEffect(() => {
        dispatch(listSalesOrder());
        dispatch(listCustomer());
    }, [])

    useEffect(() => {
        props.onSelectId(selected); // Notify parent component about selected IDs
    }, [selected]);

    const [salesOrderList, salesOrderListLoading] = useAppSelector(
        (state) => [
            state.salesOrderReducers.salesOrderList,
            state.salesOrderReducers.salesOrderListLoading,
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [isDeliveryTicketModalOpen, setDeliveryTicketModalOpen] = useState(false);
    const [selectedSalesOrderId, setSelectedSalesOrderId] = useState<number | null>(null);

    // Function to toggle the Delivery Ticket Modal
    const toggleDeliveryTicketModal = (salesOrderId: number | null) => {
        setSelectedSalesOrderId(salesOrderId);
        setDeliveryTicketModalOpen(!isDeliveryTicketModalOpen);
    };


    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when searching
    };
    const handleSelect = (id: number) => {
        setSelected(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
        props.onSelectId(selected); // Propagate selected IDs to parent
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // Assuming sortedData is available as part of the component state or props
            setSelected(sortedData.map(item => item.Id));
        } else {
            setSelected([]);
        }
        props.onSelectId(selected); // Propagate selected IDs to parent
    };

    const filteredSalesOrderListData = salesOrderList.filter(item =>
        Object.entries(item).some(([key, value]) =>
            (filterColumn ? key === filterColumn : true) &&
            (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const sortedData = sortData(filteredSalesOrderListData, getComparator(order, orderBy));

    const csvHeaders = [
        { label: "InvoiceStatus", key: "InvoiceStatus" },
        { label: "DocNumber", key: "DocNumber" },
        { label: "DeliveryStatus", key: "DeliveryStatus" },
        { label: "OrderDateTime", key: "OrderDateTime" },
        { label: "ExpectedDateTime", key: "ExpectedDateTime" },
        { label: "SOStatus", key: "SOStatus" },
        { label: "TotalAmt", key: "TotalAmt" },
    ];

    const csvData = salesOrderList.map((item: any) => ({
        InvoiceStatus: item.InvoiceStatus,
        DocNumber: item.DocNumber,
        DeliveryStatus: item.DeliveryStatus,
        OrderDateTime: item.OrderDateTime,
        ExpectedDateTime: item.ExpectedDateTime,
        SOStatus: item.SOStatus,
        TotalAmt: item.TotalAmt,
    }));

    const componentRef = useRef<HTMLTableElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const columnOptions = [
        { name: 'InvoiceStatus', key: 'InvoiceStatus' },
        { name: 'DocNumber', key: 'DocNumber' },
        { name: 'DeliveryStatus', key: 'DeliveryStatus' },
        { name: 'OrderDateTime', key: 'OrderDateTime' },
        { name: 'ExpectedDateTime', key: 'ExpectedDateTime' },
        { name: 'SOStatus', key: 'SOStatus' },
        { name: 'TotalAmt', key: 'TotalAmt' },
    ];
    const filteredColumns = columnOptions.filter(column =>
        column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
    );

    const deleteStates = async () => {
        try {
            const action = await dispatch(deleteSalesOrder({ sales_order_id: editId }));
            const response = action.payload;
            props.setEditData(null);
            resetDeleteData(); // Reset delete confirmation state
            if (response.message.code === "SUCCESS") {
                dispatch(listSalesOrder())
            }
            toast.success("Data deleted successfully");
        } catch (error) {
            // Handle error
        }
    };

    const generateInvoicePdf = async (item: any) => {
        // Set invoice data for review
        setInvoiceData(item);
        // console.log({ GENERATEINVOICE: item.CustomersFId })
        // Open the review modal
        setReviewModalOpen(true);
        // dispatch(getBillAddressCustomer({
        //     customer_bill_address_id: item.CustomersFId
        // }))
        await dispatch(getBillToAddresses({
            address_id: item.InvoiceAddressFID
        }))
        await dispatch(getShipToAddresses({
            address_id: item.DeliveryAddressFID
        }))
    };

    const handleModalClose = () => {
        // Close the review modal
        setReviewModalOpen(false);
        // Clear invoice data
        setInvoiceData(null);
    };

    const extractOtherChargesIds = (otherCharges: Charge[]): number[] => {
        return otherCharges.map((charge: Charge) => charge.Id);
    };

    if (salesOrderListLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /></div>;
    }
    const handledownlaodInvoice = () => {
        toast.success("download successfull");
    }

    return (
        <>
            <TableContainer component={Paper}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                    <div className="filterColumn">
                        <Button
                            variant="outlined"
                            startIcon={<ViewColumnIcon />}
                            onClick={handleMenuOpen}
                            style={{ marginRight: '16px' }}
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
                                {filteredColumns.map((column: any) => (
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
                            style={{ marginRight: '16px' }}
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
                                            <MenuItem value="CustomersFId">CustomersFId</MenuItem>
                                            <MenuItem value="DocNumber">DocNumber</MenuItem>
                                            <MenuItem value="InvoiceStatus">InvoiceStatus</MenuItem>
                                            <MenuItem value="DeliveryStatus">DeliveryStatus</MenuItem>
                                            <MenuItem value="ExpectedDateTime">ExpectedDateTime</MenuItem>
                                            <MenuItem value="OrderDateTime">OrderDateTime</MenuItem>
                                            <MenuItem value="SOStatus">SOStatus</MenuItem>
                                            <MenuItem value="TotalAmt">TotalAmt</MenuItem>
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
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={selected.length === sortedData.length} // Check if all items are selected
                                />
                            </TableCell>
                            <TableCell sx={tesStyle}>SN</TableCell>
                            {visibleColumns.CustomersFId && (
                                <TableCell sortDirection={orderBy === 'CustomersFId' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('CustomersFId')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Customers
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
                            {visibleColumns.OrderDateTime && (
                                <TableCell sortDirection={orderBy === 'OrderDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('OrderDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            OrderDateTime
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
                            {visibleColumns.ExpectedDateTime && (
                                <TableCell sortDirection={orderBy === 'ExpectedDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('ExpectedDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Arrived Date Time
                                            {orderBy === 'ExpectedDateTime' ? (
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
                            {visibleColumns.SOStatus && (
                                <TableCell sortDirection={orderBy === 'SOStatus' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('SOStatus')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            SOStatus
                                            {orderBy === 'SOStatus' ? (
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
                            {/* {visibleColumns.InvoiceStatus && (
                                <TableCell sortDirection={orderBy === 'InvoiceStatus' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('InvoiceStatus')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Invoice Status
                                            {orderBy === 'InvoiceStatus' ? (
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
                            {visibleColumns.DeliveryStatus && (
                                <TableCell sortDirection={orderBy === 'DeliveryStatus' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('DeliveryStatus')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            Delivery Status
                                            {orderBy === 'DeliveryStatus' ? (
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

                            {visibleColumns.TotalAmt && (
                                <TableCell sortDirection={orderBy === 'TotalAmt' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('TotalAmt')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            TotalAmt
                                            {orderBy === 'TotalAmt' ? (
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
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selected.includes(item.Id)} // Check if the item is selected
                                                onChange={() => handleSelect(item.Id)} // Toggle selection
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        {visibleColumns.CustomersFId && <TableCell>{findCustomerName(item.CustomersFId)}</TableCell>}
                                        {visibleColumns.DocNumber && <TableCell>SO-{item.DocNumber}</TableCell>}
                                        {visibleColumns.OrderDateTime && <TableCell>{moment.utc(item.OrderDateTime).format('MM/DD/YYYY hh:mm A')}</TableCell>}
                                        {visibleColumns.ExpectedDateTime && <TableCell>{moment.utc(item.ExpectedDateTime).format('MM/DD/YYYY hh:mm A')}</TableCell>}
                                        {visibleColumns.SOStatus && (
                                            <TableCell>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            borderRadius: '50%',
                                                            backgroundColor: item.SOStatus === 'Opened' ? 'green' : item.SOStatus === 'Closed' ? 'red' : 'grey',
                                                            marginRight: '8px'
                                                        }}
                                                    ></div>
                                                    {item.SOStatus}
                                                </div>
                                            </TableCell>
                                        )}
                                        {/* {visibleColumns.InvoiceStatus && <TableCell>{item.InvoiceStatus}</TableCell>} */}
                                        {/* {visibleColumns.InvoiceStatus && (
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        backgroundColor: item.InvoiceStatus === true ? 'green' : item.InvoiceStatus === false ? 'red' : 'grey',
                                                        marginLeft: '10px'
                                                    }}
                                                ></div>

                                            </div>
                                        </TableCell>
                                    )}

                                    {visibleColumns.DeliveryStatus && (
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        backgroundColor: item.DeliveryStatus === true ? 'green' : item.DeliveryStatus === false ? 'red' : 'grey',
                                                        marginRight: '8px'
                                                    }}
                                                ></div>

                                            </div>
                                        </TableCell>
                                    )} */}

                                        {visibleColumns.TotalAmt && <TableCell>{item.TotalAmt}</TableCell>}
                                        <TableCell className='no-print' sx={{ whiteSpace: 'nowrap' }}>
                                            <ListItemIcon sx={tableListItemStyles} onClick={() => {
                                                // Extract OtherChargesIds from the clicked item
                                                // const otherChargesIds = extractOtherChargesIds(item.OtherCharges);

                                                // Set the edit data with the modified item
                                                props.setEditData({
                                                    ...item,
                                                    // OtherChargesIds: otherChargesIds, // Replace OtherCharges with OtherChargesIds
                                                    // OtherCharges: undefined, // Remove OtherCharges
                                                });

                                                // Toggle the edit modal
                                                props.toggleForm();
                                            }} >
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <ModeEditOutlineIcon sx={{ cursor: 'pointer', marginRight: 1 }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemIcon sx={{ minWidth: '24px' }}>
                                                <Tooltip title="Delete" placement="top" arrow>
                                                    <DeleteOutlineIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleDeleteClick(item.Id)} />
                                                </Tooltip>
                                            </ListItemIcon>
                                            {/* {item.SOStatus === 'Closed' && */}
                                            <ListItemIcon sx={{ minWidth: '24px' }}>
                                                <Tooltip title="Invoice" placement="top" arrow onClick={() => generateInvoicePdf(item)}>
                                                    <SummarizeIcon sx={{ cursor: 'pointer', marginRight: 1 }} />
                                                </Tooltip>
                                            </ListItemIcon>

                                            <ListItemIcon sx={{ minWidth: '24px' }}>
                                                <Tooltip title="Delivery Ticket" placement="top" arrow>
                                                    <ReceiptIcon
                                                        sx={{ cursor: 'pointer', marginRight: 1 }}
                                                        onClick={() => toggleDeliveryTicketModal(item.Id)}
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>

                                            {/* } */}
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
                handleConfirmClick={() => deleteStates()}
            />

            <GeneralModal open={reviewModalOpen} handleClose={() => setReviewModalOpen(false)} title="Review Sales Invoice" width="70%">
                <SalesOrderInvoice invoiceData={invoiceData} />
            </GeneralModal>

            <GeneralModal
                open={isDeliveryTicketModalOpen}
                handleClose={() => toggleDeliveryTicketModal(null)}
                title="Delivery Ticket"
                width="70%"
            >
                <SalesOrderDeliveryTicket salesOrderId={selectedSalesOrderId} />
            </GeneralModal>

        </>
    )
}

export default SalesOrderList;
