import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
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
import { tableListItemStyles } from 'features/Customer/pages/styles';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { shallowEqual } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { listCustomerAssest } from 'store/slices/customerassestsSlice';
import { listCustomerFreightRule } from 'store/slices/customerFreightRule';
import { listCustomerPR } from 'store/slices/customerPriceRuleSlice';
import { deleteCustomer, listCustomer } from 'store/slices/customerSlice';
interface Props {
  setFetchCustomer: any;
  // toggleModal: () => void;
  setEditData?: any
  toggleForm: () => void;
  toggleDetails: () => void;
  setCustomerPR?: any;
  setCustomerAssets?: any;
  setCustomerFR?: any;
}

const tesStyle = (theme: any) => ({
  fontSize: theme.customTable.fontSize.sm

})


const CustomerList = (props: Props) => {

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
    FirstName: false, LastName: false, DisplayName: true,
    PrimaryPhone: true, AlternatePhone: false, Mobile: true, Other: false,
  });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  const dispatch = useAppDispatch();

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page when searching
  };
  useEffect(() => {
    dispatch(listCustomer());
  }, []);

  const [customerList, listcustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.listcustomerLoading,
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

  const handleClickRow = async (item: any) => {
    // Set the fetched customer data using the provided function
    props.setFetchCustomer(item);
    try {
      props.toggleDetails();
      const action = await dispatch(listCustomerPR({
        customerPR_id: item.Id
      }));
      const customerAction = await dispatch(listCustomerAssest({
        customerAssest_id: item.Id
      }))
      const customerFreightRule = await dispatch(listCustomerFreightRule({
        customerFR_id: item.Id
      }));
      props.setCustomerAssets(customerAction.payload.message.data)
      // console.log({action})
      props.setCustomerPR(action.payload.message.data)

      props.setCustomerFR(customerFreightRule.payload.message.data)
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteCustomers = async () => {
    try {
      const action = await dispatch(deleteCustomer({ customer_id: editId }));
      const response = action.payload;
      toast.success("Data deleted successfully");
      props.setEditData(null);
      resetDeleteData(); // Reset delete confirmation state
      console.log({ response });
      if (response.message.code === "SUCCESS") {
        await dispatch(listCustomer());
      }
    } catch (error) {
      toast.error("Error");
      // Handle error
    }
  };


  // const filteredCustomerListData = customerList.filter(item =>
  //   Object.values(item).some(value =>
  //     typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );

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
  const filteredcustomerListData = customerList.filter(item =>
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

  const sortedData = sortData(filteredcustomerListData, getComparator(order, orderBy));

  const csvHeaders = [
    { label: "FirstName", key: "FirstName" },
    { label: "LastName", key: "LastName" },
    { label: "CustomerName", key: "DisplayName" },
    { label: "PrimaryPhone", key: "PrimaryPhone" },
    { label: "AlternatePhone", key: "AlternatePhone" },
    { label: "Mobile", key: "Mobile" },
    { label: "Other", key: "Other" },
  ];

  const csvData = customerList.map(item => ({
    FirstName: item.GivenName,
    LastName: item.FamilyName,
    DisplayName: item.DisplayName,
    PrimaryPhone: item.PrimaryPhone,
    AlternatePhone: item.AlternatePhone,
    Mobile: item.Mobile,
    Other: item.Other,
  }));

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: 'FirstName', key: 'FirstName' },
    { name: 'LastName', key: 'LastName' },
    { name: 'DisplayName', key: 'DisplayName' },
    { name: 'PrimaryPhone', key: 'PrimaryPhone' },
    { name: 'AlternatePhone', key: 'AlternatePhone' },
    { name: 'Mobile', key: 'Mobile' },
    { name: 'Other', key: 'Other' },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  if (listcustomerLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /> </div>
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
                      <MenuItem value="LastName">LastName</MenuItem>
                      <MenuItem value="DisplayName">DisplayName</MenuItem>
                      <MenuItem value="PrimaryPhone">PrimaryPhone</MenuItem>
                      <MenuItem value="AlternatePhone">AlternatePhone</MenuItem>
                      <MenuItem value="Mobile">Mobile</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
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
                      Customer Name
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
              {visibleColumns.AlternatePhone && (
                <TableCell sortDirection={orderBy === 'AlternatePhone' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('AlternatePhone')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      AlternatePhone
                      {orderBy === 'AlternatePhone' ? (
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

              {visibleColumns.Mobile && (
                <TableCell sortDirection={orderBy === 'Mobile' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Mobile')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Mobile
                      {orderBy === 'Mobile' ? (
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
              {visibleColumns.Other && (
                <TableCell sortDirection={orderBy === 'Other' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Other')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Other
                      {orderBy === 'Other' ? (
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
                    {visibleColumns.FirstName && <TableCell>{item.GivenName}</TableCell>}
                    {visibleColumns.LastName && <TableCell>{item.FamilyName}</TableCell>}
                    {visibleColumns.DisplayName && <TableCell>{item.DisplayName}</TableCell>}
                    {visibleColumns.PrimaryPhone && <TableCell>{item.PrimaryPhone}</TableCell>}
                    {visibleColumns.AlternatePhone && <TableCell>{item.AlternatePhone}</TableCell>}
                    {visibleColumns.Mobile && <TableCell>{item.Mobile}</TableCell>}
                    {visibleColumns.Other && <TableCell>{item.Other}</TableCell>}
                    <TableCell className='no-print'>
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
                      <ListItemIcon sx={{ minWidth: '24px' }} onClick={() => handleClickRow(item)}>
                        <Tooltip title="View Details" placement="top" arrow>
                          <BrowserUpdatedIcon sx={{ cursor: 'pointer' }} />
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
        handleConfirmClick={() => deleteCustomers()}
      />
    </>
  )
}

export default CustomerList;