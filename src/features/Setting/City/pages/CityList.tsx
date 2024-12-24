import React, { useEffect, useState, useRef } from 'react';
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
} from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import { deleteCity, listCity } from 'store/slices/citySlice';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import { toast } from 'react-toastify';
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

interface Props {
  setEditData?: any;
  toggleForm?: any;
}

const CityList = (props: Props, { ...args }) => {
  const { editId, modal, toggleModal, handleDeleteClick, resetDeleteData } = useDeleteConfirmation();

  const dispatch = useAppDispatch();

  const [cityList, listCityLoading] = useAppSelector(
    (state) => [
      state.cityReducers.cityList || [],
      state.cityReducers.listCityLoading,
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(listCity());
  }, [dispatch]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<any>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<any>(null);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<any>({
    StateName: true,
    Name: true,
  });

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

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

  const handleDeleteCities = async () => {
    try {
      const action = await dispatch(deleteCity({ city_id: editId }));
      const response = action.payload;
      toggleModal();
      resetDeleteData();
      console.log({ response })
      if (response.message.code === 'SUCCESS') {
        dispatch(listCity())
      }
      toast.success('City deleted successfully');
    } catch (error) {
      console.log(error);
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

  const handleExportClose: any = () => {
    setExportAnchorEl(null);
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose: any = () => {
    setFilterAnchorEl(null);
  };

  const filteredCityListData = cityList.filter(item =>
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

  const sortedData = sortData(filteredCityListData, getComparator(order, orderBy));

  const csvHeaders = [
    { label: "State", key: "StateName" },
    { label: "City", key: "Name" }
  ];

  const csvData = cityList.map(item => ({
    StateName: item.StateName,
    Name: item.Name
  }));

  const componentRef = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const columnOptions = [
    { name: 'State', key: 'StateName' },
    { name: 'City', key: 'Name' },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );
  if (listCityLoading) {
    return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /></div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
          {/* <div className="search">
            <TextField
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              margin="dense"
              size='small'
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{ marginRight: '16px', marginTop: '0px' }}
            />
          </div> */}
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
                <CSVLink data={csvData} headers={csvHeaders} filename="city_list.csv" style={{ color: '#000', textDecoration: 'none', display: 'flex' }}>
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
                      <MenuItem value="StateName">State</MenuItem>
                      <MenuItem value="Name">City</MenuItem>
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
          <TableHead>
            <TableRow sx={{ background: '#EFEFEF' }}>
              <TableCell>SN</TableCell>
              {visibleColumns.StateName && (
                <TableCell sortDirection={orderBy === 'StateName' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('StateName')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      State
                      {orderBy === 'StateName' ? (
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
              {visibleColumns.Name && (
                <TableCell sortDirection={orderBy === 'Name' ? order : false}>
                  <Tooltip title="Sort" placement="top" arrow>
                    <span
                      onClick={() => handleRequestSort('Name')}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      City
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
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item, index) => (
                  <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                    <TableCell>{index + 1}</TableCell>
                    {visibleColumns.StateName && <TableCell>{item.StateName}</TableCell>}
                    {visibleColumns.Name && <TableCell>{item.Name}</TableCell>}
                    <TableCell className="no-print" sx={{ display: 'flex' }}>
                      <ListItemIcon sx={{ minWidth: '30px' }}
                        onClick={() => {
                          props.setEditData(item)
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
        handleConfirmClick={() => handleDeleteCities()}
      />
    </>
  )
}

export default CityList;