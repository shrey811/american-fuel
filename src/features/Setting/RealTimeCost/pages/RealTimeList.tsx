import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
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
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem as MuiMenuItem,
  Collapse,
  Box,
} from '@mui/material';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteRealTimeCost, listRealTimeCost } from 'store/slices/realtimecostSlice';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { collapseTableCell } from './styles';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download'
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  setEditData?: any;
  toggleForm?: any;
}

const RealTimeList = (props: Props) => {

  const { editId, modal, toggleModal, handleDeleteClick, resetDeleteData } = useDeleteConfirmation();

  const [openRows, setOpenRows] = useState<number[]>([]); // State to track open rows
  const [openAllDetailRows, setOpenAllDetailRows] = useState<number[]>([]); // State to track open All details rows
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>
    ({ VendorName: true, ProductName: true, TerminalName: true, Cost: true, EffectiveDateTime: true });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  const dispatch = useAppDispatch();

  const [realtimeList, listRealTimeLoading] = useAppSelector(
    (state) => [
      state.realtimeReducers.realtimeList || [],
      state.realtimeReducers.listRealTimeLoading,
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(listRealTimeCost());
  }, []);

  // Event handlers
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

  // const slicedData = realtimeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDeleteRealTime = async () => {
    try {
      const action = await dispatch(deleteRealTimeCost({ product_realtime_cost_id: editId }));
      const response = action.payload;
      toggleModal();
      resetDeleteData();
      if (response.message.code === 'SUCCESS') {
        dispatch(listRealTimeCost())
      }
      toast.success('Real Time Cost deleted successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowToggle = (index: number) => {
    setOpenRows(openRows.includes(index) ? openRows.filter(i => i !== index) : [...openRows, index]);
  };

  const handleAllDetailRowToggle = (index: number) => {
    setOpenAllDetailRows(openAllDetailRows.includes(index) ? openAllDetailRows.filter(i => i !== index) : [...openAllDetailRows, index]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  const filteredRealTimeListData = Array.isArray(realtimeList)
    ? realtimeList.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          (filterColumn ? key === filterColumn : true) &&
          typeof value === 'string' &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : [];

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

  const sortedData = sortData(filteredRealTimeListData, getComparator(order, orderBy));

  const csvHeaders = [
    { label: 'Vendor Name', key: 'VendorName' },
    { label: 'Product Name', key: 'ProductName' },
    { label: 'Terminal Name', key: 'TerminalName' },
    { label: 'Cost', key: 'Cost' },
    { label: 'Efffective Date', key: 'EffectiveDateTime' },
  ];

  const csvData = Array.isArray(realtimeList)
    ? realtimeList.map((item) => ({
      VendorName: item.Vendors,
      ProductName: item.Products,
      TerminalName: item.Terminals,
      Cost: item.Cost,
      EfffectiveDate: item.EffectiveDateTime,
    }))
    : [];

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: "Vendor Name", key: "VendorName" },
    { name: "Product Name", key: "ProductName" },
    { name: "Terminal Name", key: "TerminalName" },
    { name: "Cost", key: "Cost" },
    { name: "Efffective Date", key: "EffectiveDateTime" }
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  if (listRealTimeLoading) {
    return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /></div>;
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
                <CSVLink data={csvData} headers={csvHeaders} filename="RealTimeCost.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                      <MenuItem value="VendorName">Supplier Name</MenuItem>
                      <MenuItem value="ProductName">Product Name</MenuItem>
                      <MenuItem value="TerminalName">Terminal Name</MenuItem>
                      <MenuItem value="Cost">Cost</MenuItem>
                      <MenuItem value="EffectiveDateTime">Effective Date</MenuItem>
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
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              <TableCell />
              <TableCell>Vendor Name</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (sortedData?.map((item, index) => (
              <React.Fragment>
                <TableRow key={index}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowToggle(index)}
                    >
                      {openRows.includes(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{item.Vendors}</TableCell>
                  <TableCell>{moment(item.EffectiveDateTime).format('MM/DD/YYYYHH:mm A')}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => {
                      // Set the edit data with the clicked item
                      props.setEditData(item);
                      // Toggle the edit modal
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
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRows.includes(index)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              <TableCell sx={collapseTableCell}>Terminal Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => handleAllDetailRowToggle(index)}
                                >
                                  {openAllDetailRows.includes(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                              </TableCell>
                              <TableCell>{item.Terminals}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openAllDetailRows.includes(index)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow sx={{ background: '#f5f5f5' }}>
                              <TableCell>SN</TableCell>
                              {visibleColumns.VendorName && (
                                <TableCell sortDirection={orderBy === 'VendorName' ? order : false}>
                                  <Tooltip title="Sort" placement="top" arrow>
                                    <span
                                      onClick={() => handleRequestSort('VendorName')}
                                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      Vendor Name
                                      {orderBy === 'VendorName' ? (
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
                              {/* <TableCell>Vendor Name</TableCell> */}
                              {visibleColumns.ProductName && (
                                <TableCell sortDirection={orderBy === 'ProductName' ? order : false}>
                                  <Tooltip title="Sort" placement="top" arrow>
                                    <span
                                      onClick={() => handleRequestSort('ProductName')}
                                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      Product Name
                                      {orderBy === 'ProductName' ? (
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
                              {/* <TableCell>Product Name</TableCell> */}
                              {visibleColumns.TerminalName && (
                                <TableCell sortDirection={orderBy === 'TerminalName' ? order : false}>
                                  <Tooltip title="Sort" placement="top" arrow>
                                    <span
                                      onClick={() => handleRequestSort('TerminalName')}
                                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      Terminal Name
                                      {orderBy === 'TerminalName' ? (
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
                              {/* <TableCell>Terminal Name</TableCell> */}
                              {visibleColumns.Cost && (
                                <TableCell sortDirection={orderBy === 'Cost' ? order : false}>
                                  <Tooltip title="Sort" placement="top" arrow>
                                    <span
                                      onClick={() => handleRequestSort('Cost')}
                                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      Cost
                                      {orderBy === 'Cost' ? (
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
                              {/* <TableCell>Cost</TableCell> */}
                              {visibleColumns.EffectiveDateTime && (
                                <TableCell sortDirection={orderBy === 'EffectiveDateTime' ? order : false}>
                                  <Tooltip title="Sort" placement="top" arrow>
                                    <span
                                      onClick={() => handleRequestSort('EffectiveDateTime')}
                                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      Effective Date
                                      {orderBy === 'EffectiveDateTime' ? (
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
                              {/* <TableCell>Effective Date</TableCell> */}
                              {/* <TableCell sx={{ width: '15%' }}>Action</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableCell>{index}</TableCell>
                            {visibleColumns.VendorName && <TableCell>{item.Vendors}</TableCell>}
                            {/* <TableCell>{item.Vendors}</TableCell> */}
                            {visibleColumns.ProductName && <TableCell>{item.Products}</TableCell>}
                            {/* <TableCell>{item.Products}</TableCell> */}
                            {visibleColumns.TerminalName && <TableCell>{item.Terminals}</TableCell>}
                            {/* <TableCell>{item.Terminals}</TableCell> */}
                            {visibleColumns.Cost && <TableCell>{item.Cost}</TableCell>}
                            {/* <TableCell>{item.Cost}</TableCell> */}
                            {visibleColumns.EffectiveDateTime && <TableCell>{item.EffectiveDateTime}</TableCell>}
                            {/* <TableCell>{moment(item.EffectiveDateTime).format('MM/DD/YYYYHH:mm A')}</TableCell> */}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 35, 45]}
        component="div"
        count={filteredRealTimeListData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationModal
        open={modal}
        handleModal={toggleModal}
        handleConfirmClick={() => handleDeleteRealTime()}
      />
    </>
  )
}

export default RealTimeList;