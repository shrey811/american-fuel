import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
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
} from '@mui/material';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteTax, listTax } from 'store/slices/taxSlice';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import SearchIcon from '@mui/icons-material/Search';
import { CSVLink } from 'react-csv';
import { useReactToPrint } from 'react-to-print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import TaxModal from './TaxModal';

interface Props {
  setEditData?: any;
  toggleForm?: any;
}

const TaxList = (props: Props) => {
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
    Name: true, Type: true, Code: true, State: true, City: true,
  });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(listTax());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [taxList, listTaxLoading] = useAppSelector(
    (state) => [
      state.taxReducers.taxList,
      state.taxReducers.listTaxLoading
    ],
    shallowEqual
  );

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteTaxs = async () => {
    try {
      const action = await dispatch(deleteTax({ tax_id: editId }));
      const response = action.payload;
      props.setEditData(null);
      resetDeleteData(); // Reset delete confirmation state
      if (response.message.code === "SUCCESS") {
        dispatch(listTax())
      }
      toast.success("Data deleted successfully");
    } catch (error) {
      // Handle error
    }
  };

  const handleSearchChange = (event: any) => {
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
  // const filteredTaxListData = taxList.filter(item =>
  //   Object.entries(item).some(([key, value]) =>
  //     (filterColumn ? key === filterColumn : true) &&
  //     (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
  //   )

  // );
  const filteredTaxListData = useMemo(() => {
    return taxList.filter(item =>
      Object.entries(item).some(([key, value]) =>
        (filterColumn ? key === filterColumn : true) &&
        (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [taxList, filterColumn, searchQuery]);

  console.log("filteredTaxListData", filteredTaxListData)

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

  const sortedData = sortData(filteredTaxListData, getComparator(order, orderBy));
  console.log("sortedData", sortedData);

  const csvHeaders = [
    { label: "TaxName", key: "Name" },
    { label: "Type", key: "Type" },
    { label: "Rate", key: "Rate" },
    { label: "Code", key: "Code" },
    { label: "UnitType", key: "UnitType" },
    { label: "Unit", key: "Unit" },

  ];

  const csvData = taxList.map((item: any) => ({
    Name: item.Name,
    Type: item.Type,
    Code: item.Code,
    State: item.StateName,
    City: item.CityName
  }));
  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columnOptions = [
    { name: 'TaxName', key: 'Name' },
    { name: 'Type', key: 'Type' },
    { name: 'Code', key: 'Code' },
    { name: 'State', key: 'StateName' },
    { name: 'City', key: 'CityName' },

  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  if (listTaxLoading) {
    return <FallbackLoader />;
  }

  if (sortedData.length === 0) {
    return <div style={{ textAlign: 'center' }}>No data available</div>;
  }

  return (
    <>
      <TableContainer component={Paper} className="demo-----------------------">
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
                <CSVLink data={csvData} headers={csvHeaders} filename="Taxlist.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                      <MenuItem value="Name">TaxName</MenuItem>
                      <MenuItem value="Type">Type</MenuItem>
                      <MenuItem value="Rate">Code</MenuItem>
                      <MenuItem value="Code">State</MenuItem>
                      <MenuItem value="UnitType">City</MenuItem>

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
        <Table ref={componentRef} sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead >
            <TableRow sx={{ background: '#EFEFEF' }}>
              <TableCell>SN</TableCell>
              {visibleColumns.Name && (
                <TableCell sortDirection={orderBy === 'Name' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Name')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Tax Name
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
              {visibleColumns.Type && (
                <TableCell sortDirection={orderBy === 'Type' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Type')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Type
                      {orderBy === 'Type' ? (
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
              {visibleColumns.Code && (
                <TableCell sortDirection={orderBy === 'Code' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Code')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Code
                      {orderBy === 'Code' ? (
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

              {visibleColumns.State && (
                <TableCell sortDirection={orderBy === 'State' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('State')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      State
                      {orderBy === 'State' ? (
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
              {visibleColumns.City && (
                <TableCell sortDirection={orderBy === 'City' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('City')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      City
                      {orderBy === 'City' ? (
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
              <TableCell className="no-print">Actions</TableCell>
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
              sortedData?.map((item, index) => (

                <TableRow key={index}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f4f4f4cc', // Light grey color
                    },
                  }}
                  onClick={() => {
                    setSelectedRowData(item);
                    setOpenModal(true);
                  }}>

                  <TableCell>{index + 1}</TableCell>
                  {visibleColumns.Name && <TableCell>{item.Name}</TableCell>}
                  {visibleColumns.Type && <TableCell>{item.Type}</TableCell>}

                  {visibleColumns.Code && <TableCell>{item.Code}</TableCell>}
                  {visibleColumns.State && <TableCell>{item.StateName}</TableCell>}
                  {visibleColumns.City && <TableCell>{item.CityName}</TableCell>}
                  <TableCell className="no-print">
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      props.setEditData(item);
                      props.toggleForm(true);
                    }}>
                      <ModeEditOutlineIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation to parent TableRow
                        handleDeleteClick(item.Id);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))

            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 35, 45]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer >
      <TaxModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        rowData={selectedRowData}
      />

      <ConfirmationModal
        open={modal}
        handleModal={toggleModal}
        handleConfirmClick={deleteTaxs}
      />
    </>
  );
};

export default TaxList;