import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
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
  Tooltip,
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
import { listBillAddressVendor } from 'store/slices/billAddressVendorSlice';
import { listTax } from 'store/slices/taxSlice';
import { listTerminal } from 'store/slices/terminalSlice';
import { listVendor, vendorDelete } from 'store/slices/vendorSlice';

import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

interface Props {
  setEditData?: any
  toggleForm: () => void;
  toggleView: () => void;
}

const VendorList = (props: Props) => {

  const dispatch = useAppDispatch();

  const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    FirstName: false, MiddleName: false, LastName: false, DisplayName: true, PrimaryPhone: true,
    Domain: false, AccountNumber: false, CompanyName: true, WebAddress: false, PrimaryEmail: false, Balance: true,
  });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  useEffect(() => {
    dispatch(listVendor());
  }, []);

  useEffect(() => {
    dispatch(listTax());
  }, [dispatch]);

  const [vendorList, listVendorLoading] = useAppSelector(
    (state) => [
      state.vendorReducers.vendorList,
      state.vendorReducers.listVendorLoading
    ],
    shallowEqual
  );
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

  const deleteVendors = async () => {
    try {
      const action = await dispatch(vendorDelete({ vendor_id: editId }));
      const response = action.payload;
      props.setEditData(null);
      resetDeleteData(); // Reset delete confirmation state
      toast.success(response.message.message);
      if ("Add vendor is successful") {
        dispatch(listVendor())
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };



  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page when searching
  };

  const handleAddress = async (item: any) => {
    try {
      const action = await dispatch(listBillAddressVendor({ vendors_id: item }));
      const response = action.payload;
      // console.log(response);

      // const value = item
      // const terminalAction = await dispatch(listTerminal(value));
      // const terminalResponse = terminalAction.payload;
      // console.log(terminalResponse)

    } catch (error) {
      console.log(error);
    }
  }

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
  const filteredVendorListData = vendorList.filter(item =>
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

  const sortedData = sortData(filteredVendorListData, getComparator(order, orderBy));

  const csvHeaders = [
    { label: "FirstName", key: "FirstName" },
    { label: "MiddleName", key: "MiddleName" },
    { label: "LastName", key: "LastName" },
    { label: "VendorName", key: "DisplayName" },
    { label: "PrimaryPhone", key: "PrimaryPhone" },
    { label: "Domain", key: "Domain" },
    { label: "AccountNumber", key: "AccountNumber" },
    { label: "WebAddress", key: "WebAddress" },
    { label: "CompanyName", key: "CompanyName" },
    { label: "PrimaryEmail", key: "PrimaryEmail" },
    { label: "Balance", key: "Balance" },
  ];

  const csvData = vendorList.map(item => ({
    FirstName: item.GivenName,
    MiddleName: item.MiddleName,
    LastName: item.FamilyName,
    DisplayName: item.DisplayName,
    PrimaryPhone: item.PrimaryPhone,
    Domain: item.Domain,
    AccountNumber: item.AccountNumber,
    WebAddress: item.WebAddress,
    CompanyName: item.CompanyName,
    PrimaryEmail: item.PrimaryEmail,
    Balance: item.Balance,
  }));

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: 'FirstName', key: 'FirstName' },
    { name: 'MiddleName', key: 'MiddleName' },
    { name: 'LastName', key: 'LastName' },
    { name: 'DisplayName', key: 'DisplayName' },
    { name: 'PrimaryPhone', key: 'PrimaryPhone' },
    { name: 'Domain', key: 'Domain' },
    { name: 'AccountNumber', key: 'AccountNumber' },
    { name: 'WebAddress', key: 'WebAddress' },
    { name: 'CompanyName', key: 'CompanyName' },
    { name: 'PrimaryEmail', key: 'PrimaryEmail' },
    { name: 'Balance', key: 'Balance' },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  if (listVendorLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /></div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        {/* <TextField
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
        /> */}
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
                      <MenuItem value="FirstName">FirstName</MenuItem>
                      <MenuItem value="MiddleName">MiddleName</MenuItem>
                      <MenuItem value="LastName">LastName</MenuItem>
                      <MenuItem value="DisplayName">DisplayName</MenuItem>
                      <MenuItem value="PrimaryPhone">PrimaryPhone</MenuItem>
                      <MenuItem value="Domain">Domain</MenuItem>
                      <MenuItem value="AccountNumber">AccountNumber</MenuItem>
                      <MenuItem value="CompanyName">CompanyName</MenuItem>
                      <MenuItem value="WebAddress">WebAddress</MenuItem>
                      <MenuItem value="PrimaryEmail">PrimaryEmail</MenuItem>
                      <MenuItem value="Balance">Balance</MenuItem>
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
              {visibleColumns.FirstName && (
                <TableCell sortDirection={orderBy === 'FirstName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('FirstName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      FirstName
                      {orderBy === 'FirstName' ? (
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
              {visibleColumns.MiddleName && (
                <TableCell sortDirection={orderBy === 'MiddleName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('MiddleName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      MiddleName
                      {orderBy === 'MiddleName' ? (
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
              {visibleColumns.LastName && (
                <TableCell sortDirection={orderBy === 'LastName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('LastName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      LastName
                      {orderBy === 'LastName' ? (
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
              {visibleColumns.DisplayName && (
                <TableCell sortDirection={orderBy === 'DisplayName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('DisplayName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Supplier Name
                      {orderBy === 'DisplayName' ? (
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
              {visibleColumns.PrimaryPhone && (
                <TableCell sortDirection={orderBy === 'PrimaryPhone' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('PrimaryPhone')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      PrimaryPhone
                      {orderBy === 'PrimaryPhone' ? (
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
              {visibleColumns.Domain && (
                <TableCell sortDirection={orderBy === 'Domain' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Domain')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Domain
                      {orderBy === 'Domain' ? (
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
              {visibleColumns.AccountNumber && (
                <TableCell sortDirection={orderBy === 'AccountNumber' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('AccountNumber')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      AccountNumber
                      {orderBy === 'AccountNumber' ? (
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
              {visibleColumns.CompanyName && (
                <TableCell sortDirection={orderBy === 'CompanyName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('CompanyName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Company Name
                      {orderBy === 'CompanyName' ? (
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
              {visibleColumns.WebAddress && (
                <TableCell sortDirection={orderBy === 'WebAddress' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('WebAddress')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      WebAddress
                      {orderBy === 'WebAddress' ? (
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
              {visibleColumns.PrimaryEmail && (
                <TableCell sortDirection={orderBy === 'PrimaryEmail' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('PrimaryEmail')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      PrimaryEmail
                      {orderBy === 'PrimaryEmail' ? (
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
              {visibleColumns.Balance && (
                <TableCell sortDirection={orderBy === 'Balance' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Balance')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Balance
                      {orderBy === 'Balance' ? (
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
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item, index) => (
                  <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                    <TableCell>{index + 1}</TableCell>
                    {visibleColumns.FirstName && <TableCell>{item.GivenName}</TableCell>}
                    {visibleColumns.MiddleName && <TableCell>{item.MiddleName}</TableCell>}
                    {visibleColumns.LastName && <TableCell>{item.FamilyName}</TableCell>}
                    {visibleColumns.DisplayName && <TableCell>{item.DisplayName}</TableCell>}
                    {visibleColumns.PrimaryPhone && <TableCell>{item.PrimaryPhone}</TableCell>}
                    {visibleColumns.Domain && <TableCell>{item.Domain}</TableCell>}
                    {visibleColumns.AccountNumber && <TableCell>{item.AccountNumber}</TableCell>}
                    {visibleColumns.CompanyName && <TableCell>{item.CompanyName}</TableCell>}
                    {visibleColumns.WebAddress && <TableCell>{item.WebAddress}</TableCell>}
                    {visibleColumns.PrimaryEmail && <TableCell>{item.PrimaryEmail}</TableCell>}
                    {visibleColumns.Balance && <TableCell>{item.Balance}</TableCell>}
                    <TableCell className="no-print">
                      <ListItemIcon sx={{ minWidth: '30px' }}
                        onClick={() => handleDeleteClick(item.Id)}>
                        <Tooltip title="Delete" placement="top" arrow>
                          <DeleteOutlineIcon sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => {
                        // Set the edit data with the clicked item
                        props.setEditData(item);

                        // Toggle the edit modal
                        props.toggleForm();
                        handleAddress(item.Id);
                        props.toggleView();
                      }}>
                        <Tooltip title="View Details" placement="top" arrow>
                          <ModeEditOutlineIcon sx={{ cursor: 'pointer' }} />
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
        count={filteredVendorListData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationModal
        open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() => deleteVendors()}
      />
    </>
  )
}

export default VendorList;