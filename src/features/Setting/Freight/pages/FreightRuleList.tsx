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
import { deleteFreightRule, listFreightRule } from 'store/slices/freightRuleSlice';

interface Props {
  setEditData?: any;
  toggleForm?: any;
}

const FreightRuleList = (props: Props) => {
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
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({ ProductCategory: true, Product: true, Markup: true, Rate: true, Unit: true });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  // Fetch data using hooks

  useEffect(() => {
    dispatch(listFreightRule());
  }, [dispatch]);

  const [freightListData, freightDataLoading] = useAppSelector(
    (state) => [
      state.freightReducers.freightRuleListData,
      state.freightReducers.freightDataLoading,
    ],
    shallowEqual
  );



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

  const deleteFreightsRule = async () => {
    try {
      const action = await dispatch(deleteFreightRule({ freight_id: editId }));
      const response = action.payload;
      props.setEditData(null);
      resetDeleteData(); // Reset delete confirmation state
      if (response.message.code === "SUCCESS") {
        await dispatch(listFreightRule());
        toast.success("Data deleted successfully");
      } else {
        toast.error("Failed to delete data");
      }
    } catch (error) {
      toast.error("An error occurred while deleting data");
    }
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
  const filteredfreightListData = freightListData.filter(item =>
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

  const sortedData = sortData(filteredfreightListData, getComparator(order, orderBy));

  const csvHeaders = [
    { label: "ProductCategory", key: "ProductCategory" },
    { label: "Product", key: "Product" },
    { label: "Markup", key: "Markup" },
    { label: "Rate", key: "Rate" },
    { label: "Unit", key: "Unit" },
  ];

  const csvData = freightListData.map(item => ({
    ProductCategory: item.ProductCategory,
    Product: item.Product,
    Markup: item.Markup,
    Rate: item.Rate,
    Unit: item.Unit,
  }));

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: 'ProductCagetory', key: 'ProductCagetory' },
    { name: 'Product', key: 'Product' },
    { name: 'Markup', key: 'Markup' },
    { name: 'Rate', key: 'Rate' },
    { name: 'Unit', key: 'Unit' },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  // Render component
  return (
    <>
      {freightDataLoading ? (
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
                  <CSVLink data={csvData} headers={csvHeaders} filename="FreightRulelist.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                        <MenuItem value="ProductCategory">Product Category</MenuItem>
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="Markup">Markup</MenuItem>
                        <MenuItem value="Rate">Rate</MenuItem>
                        <MenuItem value="Unit">Unit</MenuItem>
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
                {visibleColumns.ProductCategory && (
                  <TableCell sortDirection={orderBy === 'ProductCategory' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('ProductCategory')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        ProductCategory
                        {orderBy === 'ProductCategory' ? (
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
                {visibleColumns.Product && (
                  <TableCell sortDirection={orderBy === 'Product' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Product')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Product
                        {orderBy === 'Product' ? (
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
                {visibleColumns.Markup && (
                  <TableCell sortDirection={orderBy === 'Markup' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Markup')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Markup
                        {orderBy === 'Markup' ? (
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
                {visibleColumns.Rate && (
                  <TableCell sortDirection={orderBy === 'Rate' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Rate')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Rate
                        {orderBy === 'Rate' ? (
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
                {visibleColumns.Unit && (
                  <TableCell sortDirection={orderBy === 'Unit' ? order : false}>
                    <Tooltip title="Sort" placement="top" arrow>
                      <span
                        onClick={() => handleRequestSort('Unit')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        Unit
                        {orderBy === 'Unit' ? (
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
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                      <TableCell>{index + 1}</TableCell>
                      {visibleColumns.ProductCategory && <TableCell>{item.ProductCategory}</TableCell>}
                      {visibleColumns.Product && <TableCell>{item.Product}</TableCell>}
                      {visibleColumns.Markup && <TableCell>{item.Markup}</TableCell>}
                      {visibleColumns.Rate && <TableCell>{item.Rate}</TableCell>}
                      {visibleColumns.Unit && <TableCell>{item.Unit}</TableCell>}
                      <TableCell className="no-print" sx={{ display: 'flex' }}>
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
        count={freightListData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationModal
        open={modal}
        handleModal={toggleModal}
        handleConfirmClick={deleteFreightsRule}
      />
    </>
  );
};

export default FreightRuleList;