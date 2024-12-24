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
import { deletePurchaseOrder, listPurchaseOrder } from 'store/slices/purchaseorder';
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
import moment from 'moment';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GeneralModal from 'components/UI/GeneralModal';
import PurchaseOrderInvoice from './PurchaseOrderInvoice';

interface Props {
    setEditData?: any
    toggleForm: () => void;
}

const tesStyle = (theme: any) => ({
    fontSize: theme.customTable.fontSize.sm
})

const PurchaseOrderList = (props: Props) => {
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
        VendorsFId: true, TerminalsFId: true, DriverName: true, OrderDateTime: true, DeliveryDateTime: true,
        LoadDateTime: true, DocNumber: true, BOL: true, POStatus: true, TotalAmt: true,
    });
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [filterColumn, setFilterColumn] = useState('');
    const [invoiceData, setInvoiceData] = useState<any>(null); // State to hold invoice data for review
    const [reviewModalOpen, setReviewModalOpen] = useState(false); // State to manage review modal open/close
    console.log({ invoiceData });

    useEffect(() => {
        dispatch(listPurchaseOrder());
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [purchaseOrderList, purchaseOrderListLoading] = useAppSelector(
        (state) => [
            state.purchaseOrderReducers.purchaseOrderList,
            state.purchaseOrderReducers.purchaseOrderListLoading,
        ],
        shallowEqual
    );
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


    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when searching
    };

    const filteredpurchaseListData = purchaseOrderList.filter(item =>
        Object.entries(item).some(([key, value]) =>
            (filterColumn ? key === filterColumn : true) &&
            (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

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

    const sortedData = sortData(filteredpurchaseListData, getComparator(order, orderBy));

    const csvHeaders = [
        { label: "DriverName", key: "DriverName" },
        { label: "DocNumber", key: "DocNumber" },
        { label: "OrderDateTime", key: "OrderDateTime" },
        { label: "DeliveryDateTime", key: "DeliveryDateTime" },
        { label: "LoadDateTime", key: "LoadDateTime" },
        { label: "BOL", key: "BOL" },
        { label: "POStatus", key: "POStatus" },
        { label: "TotalAmt", key: "TotalAmt" },
    ];

    const csvData = purchaseOrderList.map((item: any) => ({
        DriverName: item.DriverName,
        DocNumber: item.DocNumber,
        OrderDateTime: item.OrderDateTime,
        DeliveryDateTime: item.DeliveryDateTime,
        LoadDateTime: item.LoadDateTime,
        BOL: item.BOL,
        POStatus: item.POStatus,
        TotalAmt: item.TotalAmt,
    }));

    const componentRef = useRef<HTMLTableElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const columnOptions = [
        { name: 'DriverName', key: 'DriverName' },
        { name: 'DocNumber', key: 'DocNumber' },
        { name: 'OrderDateTime', key: 'OrderDateTime' },
        { name: 'DeliveryDateTime', key: 'DeliveryDateTime' },
        { name: 'LoadDateTime', key: 'LoadDateTime' },
        { name: 'BOL', key: 'BOL' },
        { name: 'POStatus', key: 'POStatus' },
        { name: 'TotalAmt', key: 'TotalAmt' },
    ];
    const filteredColumns = columnOptions.filter(column =>
        column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
    );

    const deleteStates = async () => {
        try {
            const action = await dispatch(deletePurchaseOrder({ purchase_order_id: editId }));
            const response = action.payload;
            props.setEditData(null);
            resetDeleteData(); // Reset delete confirmation state
            if (response.message.code === "SUCCESS") {
                dispatch(listPurchaseOrder())
            }
            toast.success("Data deleted successfully");
        } catch (error) {
            // Handle error
        }
    };

    const generateInvoicePdf = (item: any) => {
        // Set invoice data for review
        setInvoiceData(item);
        // Open the review modal
        setReviewModalOpen(true);
    };

    const handleModalClose = () => {
        // Close the review modal
        setReviewModalOpen(false);
        // Clear invoice data
        setInvoiceData(null);
    };

    if (purchaseOrderListLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /></div>;
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
                                            <MenuItem value="DocNumber">DocNumber</MenuItem>
                                            <MenuItem value="VendorName">SuplierName</MenuItem>
                                            <MenuItem value="Terminal">TerminalName </MenuItem>
                                            <MenuItem value="BOL">BOL</MenuItem>
                                            <MenuItem value="DeliveryDateTime">DeliveryDateTime</MenuItem>
                                            <MenuItem value="LoadDateTime">LoadDateTime</MenuItem>
                                            <MenuItem value="OrderDateTime">OrderDateTime</MenuItem>

                                            <MenuItem value="POStatus">POStatus</MenuItem>
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
                            <TableCell sx={tesStyle}>SN</TableCell>
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
                            {visibleColumns.DeliveryDateTime && (
                                <TableCell sortDirection={orderBy === 'DeliveryDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('DeliveryDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            DeliveryDateTime
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
                            {visibleColumns.LoadDateTime && (
                                <TableCell sortDirection={orderBy === 'LoadDateTime' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('LoadDateTime')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            LoadDateTime
                                            {orderBy === 'LoadDateTime' ? (
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

                            {visibleColumns.POStatus && (
                                <TableCell sortDirection={orderBy === 'POStatus' ? order : false}>
                                    <Tooltip title="Sort" placement="top" arrow>
                                        <span
                                            onClick={() => handleRequestSort('POStatus')}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            POStatus
                                            {orderBy === 'POStatus' ? (
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
                                <TableCell colSpan={11} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                                        <TableCell>{index + 1}</TableCell>
                                        {/* {visibleColumns.DriverName && <TableCell>{item.DriverName}</TableCell>} */}
                                        {visibleColumns.DocNumber && <TableCell>PO-{item.DocNumber}</TableCell>}
                                        {visibleColumns.VendorsFId && <TableCell>{findVendorName(item.VendorsFId)}</TableCell>}
                                        {visibleColumns.TerminalsFId && <TableCell>{findTerminalName(item.TerminalsFId)}</TableCell>}
                                        {visibleColumns.BOL && <TableCell>{item.BOL}</TableCell>}
                                        {visibleColumns.OrderDateTime && <TableCell>{moment(item.OrderDateTime).format('DD/MM/YYYY hh:mm A')}</TableCell>}
                                        {visibleColumns.DeliveryDateTime && <TableCell>{moment(item.DeliveryDateTime).format('DD/MM/YYYY hh:mm A')}</TableCell>}
                                        {visibleColumns.LoadDateTime && <TableCell>{moment(item.LoadDateTime).format('DD/MM/YYYY hh:mm A')}</TableCell>}

                                        {visibleColumns.POStatus && (
                                            <TableCell>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            borderRadius: '50%',
                                                            backgroundColor: item.POStatus === 'Opened' ? 'green' : item.POStatus === 'Closed' ? 'red' : 'grey',
                                                            marginRight: '8px'
                                                        }}
                                                    ></div>
                                                    {item.POStatus}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.TotalAmt && <TableCell>{item.TotalAmt}</TableCell>}
                                        <TableCell className='no-print' sx={{ whiteSpace: 'nowrap' }}>
                                            <ListItemIcon sx={tableListItemStyles} onClick={() => {
                                                // Set the edit data with the clicked item
                                                props.setEditData(item);

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
                                            {/* {item.POStatus === 'Closed' &&
                                            <ListItemIcon sx={{ minWidth: '24px' }}>
                                                <Tooltip title="Invooice" placement="top" arrow onClick={() => generateInvoicePdf(item)}>
                                                    <ReceiptIcon sx={{ cursor: 'pointer', marginRight: 1 }} />
                                                </Tooltip>
                                            </ListItemIcon>
                                        } */}
                                        </TableCell>
                                    </TableRow>
                                )))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 35, 45]}
                component="div"
                count={filteredpurchaseListData.length}
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
            {/* <GeneralModal open={reviewModalOpen} handleClose={() => setReviewModalOpen(false)} title="Review Purchase Invoice" width="65%">
                <PurchaseOrderInvoice invoiceData={invoiceData} />
            </GeneralModal> */}
        </>
    )
}

export default PurchaseOrderList;
