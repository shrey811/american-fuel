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
import { deleteTerminal, listAllTerminal } from 'store/slices/terminalSlice';

interface Props {
  setEditData?: any;
  toggleForm?: any;
}

const TerminalList = (props: Props) => {

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
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({ Name: true, Number: true, Address: true, Zip: true });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  const [listAllTerminals, listAllTerminalLoading] = useAppSelector(
    (state) => [
      state.terminalReducers.terminalListData,
      state.terminalReducers.listAllTerminalLoading
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(listAllTerminal());
  }, []);


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
  const filteredTerminalListData = listAllTerminals.filter(item =>
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
    { label: "Terminal", key: "Name" },
    { label: "Number", key: "Number" },
    { label: "Address", key: "Address" },
    { label: "Zip", key: "Zip" },
  ];

  const csvData = listAllTerminals.map(item => ({
    Name: item.Name,
    Number: item.Number,
    Address: item.Address,
    Zip: item.Zip,

  }));

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: "Terminal", key: "Name" },
    { name: "Number", key: "Number" },
    { name: "Address", key: "Address" },
    { name: "Zip", key: "Zip" },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );


  const deleteTerminals = async () => {
    try {
      const action = await dispatch(deleteTerminal({ terminals_id: editId }));
      const response = action.payload;
      console.log({ response })
      props.setEditData(null);
      resetDeleteData(); // Reset delete confirmation state
      toast.success(response.message.message);
      console.log({ response })
      if (response.message.code === "SUCCESS") {
        await dispatch(listAllTerminal());
        // toast.success("Data deleted successfully");
      } else {
        toast.error("Failed to delete data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };



  if (listAllTerminalLoading) {
    return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /> </div>
  }

  return (
    <>
      {listAllTerminalLoading ? (
        <div className='' style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}>
          <FallbackLoader />
        </div>
      ) : (
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
                  <CSVLink data={csvData} headers={csvHeaders} filename="Terminalist.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                        <MenuItem value="Name">Terminal</MenuItem>
                        <MenuItem value="Number">Number</MenuItem>
                        <MenuItem value="Address">Address</MenuItem>
                        <MenuItem value="Zip">Zip</MenuItem>
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
                {visibleColumns.Name && (
                  <TableCell sortDirection={orderBy === 'Name' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Name')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Terminal Name
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
                {visibleColumns.Number && (
                  <TableCell sortDirection={orderBy === 'Number' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Number')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Number
                        {orderBy === 'Number' ? (
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
                {visibleColumns.Address && (
                  <TableCell sortDirection={orderBy === 'Address' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Address')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Address
                        {orderBy === 'Address' ? (
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
                {visibleColumns.Zip && (
                  <TableCell sortDirection={orderBy === 'Zip' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Zip')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Zip
                        {orderBy === 'Zip' ? (
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
                  <TableCell colSpan={5} align="center">
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
                      {visibleColumns.Number && <TableCell>{item.Number}</TableCell>}
                      {visibleColumns.Address && <TableCell>{item.Address}</TableCell>}
                      {visibleColumns.Zip && <TableCell>{item.Zip}</TableCell>}
                      <TableCell className="no-print">
                        <ListItemIcon sx={{ minWidth: '30px' }}
                          onClick={() => {
                            props.setEditData(item);
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
      )}
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

export default TerminalList;