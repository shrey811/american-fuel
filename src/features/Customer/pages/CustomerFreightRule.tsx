import React, { useEffect, useState, useRef } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem as MuiMenuItem,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import moment from 'moment';
import { listFreightRule } from 'store/slices/freightRuleSlice';
import { addCustomerFreightRule, listCustomerFreightRule } from 'store/slices/customerFreightRule';

interface Props {
  fetchCustomer: any;
  toggleDetails: () => void;
  toggleForm: () => void;
  toggleFreightRuleForm: () => void;
  customerFR?: any;
  setCustomerFR?: any;
}

const customerFRInitialValues = {
  CustomersFId: '',
  FRF_list: [
    {
      FRFId: 0,
      EffectiveDateTime: moment.utc().format('YYYY-MM-DDTHH:mm'),
    }
  ],
};

const CustomerFreightRule = (props: Props) => {
  const dispatch = useAppDispatch();

  // State hooks
  const [initialData, setInitialData] = useState<typeof customerFRInitialValues>({
    ...customerFRInitialValues,
    FRF_list: props.customerFR?.map((item: any) => ({
      ...item,
      EffectiveDateTime: item?.EffectiveDateTime || moment.utc().format('YYYY-MM-DDTHH:mm'),
    })) || [{ EffectiveDateTime: moment.utc().format('YYYY-MM-DDTHH:mm') }],
  });


  const [isEffectiveDateTime, setEffectiveDateTime] = useState<any>('');

  // useEffect(() => {
  //   if (initialData && initialData.FRF_list && initialData.FRF_list.length > 0) {
  //     setEffectiveDateTime(
  //       initialData.FRF_list.map(item => item?.EffectiveDateTime || moment().format('YYYY-MM-DDTHH:mm'))
  //     );
  //   }
  // }, [initialData]);



  // console.log({ initialData: initialData });
  // console.log({ effectiveDateTime: isEffectiveDateTime });


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    ProductCategory: true,
    Product: true,
    Markup: true,
    Rate: true,
    Unit: true,
  });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Fetch data using hooks
  const [freightRuleListData, freightDataLoading] = useAppSelector(
    (state) => [
      state.freightReducers.freightRuleListData,
      state.freightReducers.freightDataLoading,
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(listFreightRule());
  }, [dispatch]);

  // useEffect(() => {
  //   // Pre-select rows that match with customerPR data
  //   const matchedRows = new Set<number>();
  //   freightRuleListData.forEach((item: any, index: number) => {
  //     const isMatched = props.customerPR.some((rule: any) => 
  //       rule.Id === item.Id && 
  //       rule.ProductCategory === item.ProductCategory && 
  //       rule.Product === item.Product &&
  //       rule.Markup === item.Markup &&
  //       rule.Rate === item.Rate &&
  //       rule.Unit === item.Unit
  //     );
  //     if (isMatched) {
  //       matchedRows.add(index);
  //     }
  //   });
  //   setSelectedRows(matchedRows);
  // }, [freightRuleListData, props.customerPR]);

  useEffect(() => {
    // Pre-select rows that match with customerPR data
    const matchedRows = new Set<number>();
    freightRuleListData.forEach((item: any, index: number) => {
      const isMatched = props.customerFR.some((rule: any) =>
        rule.Id === item.Id &&
        rule.ProductCategory === item.ProductCategory &&
        rule.Product === item.Product &&
        rule.Markup === item.Markup &&
        rule.Rate === item.Rate &&
        rule.Unit === item.Unit
      );
      if (isMatched) {
        matchedRows.add(index);
      }
      console.log({ isMatched })
    });

    // Set the selected rows and determine if all rows are selected
    setSelectedRows(matchedRows);
    setSelectAll(matchedRows.size === freightRuleListData.length && matchedRows.size > 0);
  }, [freightRuleListData, props.customerFR]);

  // const handleChange = (event: any) => {
  //   const { name, value } = event.target;
  //   setInitialData((prevData) => ({ ...prevData, [name]: value }));
  // }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    const index = parseInt(name.split('-')[1], 10);

    setEffectiveDateTime(event.target.value);
    setInitialData((prevState) => {
      const updatedPRFList = [...prevState.FRF_list];
      updatedPRFList[index] = {
        ...updatedPRFList[index],
        // EffectiveDateTime: value,
        EffectiveDateTime: moment.utc(value).format('YYYY-MM-DDTHH:mm'),
      };
      return { ...prevState, FRF_list: updatedPRFList };
    });
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

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // const handleRowSelect = (index: number) => {
  //   const newSelectedRows = new Set(selectedRows);
  //   if (newSelectedRows.has(index)) {
  //     newSelectedRows.delete(index);
  //   } else {
  //     newSelectedRows.add(index);
  //   }
  //   setSelectedRows(newSelectedRows);
  // };

  // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const allIndices = new Set<number>();
  //     sortedData.forEach((_, index) => allIndices.add(index));
  //     setSelectedRows(allIndices);
  //   } else {
  //     setSelectedRows(new Set());
  //   }
  //   setSelectAll(event.target.checked);
  // };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIndices = new Set<number>();
      sortedData.forEach((_, index) => allIndices.add(index));
      setSelectedRows(allIndices);
      setSelectAll(true);
    } else {
      setSelectedRows(new Set());
      setSelectAll(false);
    }
  };

  const handleRowSelect = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }

    // Check if all rows are selected to update the "Select All" checkbox
    if (newSelectedRows.size === sortedData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }

    setSelectedRows(newSelectedRows);
  };

  // const handleRowSelect = (index: number) => {
  //   const newSelectedRows = new Set(selectedRows);
  //   newSelectedRows.has(index) ? newSelectedRows.delete(index) : newSelectedRows.add(index);

  //   // Check if all rows are selected to update the "Select All" checkbox
  //   if (newSelectedRows.size === sortedData.length) {
  //     setSelectAll(true);
  //   } else {
  //     setSelectAll(false);
  //   }

  //   setSelectedRows(newSelectedRows);
  // };

  const filteredfreightListData = freightRuleListData.filter(item =>
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

  const columnOptions = [
    { name: 'ProductCategory', key: 'ProductCategory' },
    { name: 'Product', key: 'Product' },
    { name: 'Markup', key: 'Markup' },
    { name: 'Rate', key: 'Rate' },
    { name: 'Unit', key: 'Unit' },
  ];

  const filteredColumns = columnOptions.filter(column =>
    column.name.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  // const handleSubmit = async () => {
  //   if (selectedRows.size === 0) {
  //     // Show toast message if no rows are selected
  //     toast.error("Please select at least one row.");
  //     return;
  //   }
  //   try {
  //     const selectedRowsData = Array.from(selectedRows).map(index => sortedData[index]);

  //     const frfIdList = selectedRowsData.map(row => parseInt(row.Id, 10));

  //     // Log to verify IDs
  //     console.log('FRF_list:', frfIdList);

  //     // Check if all values are valid integers
  //     if (frfIdList.some(id => isNaN(id))) {
  //       throw new Error('One or more IDs are not valid integers.');
  //     }
  //     const action = await dispatch(addCustomerPR({
  //       CustomersFId: props.fetchCustomer.Id,
  //       FRF_list: frfIdList
  //     }));
  //     props.toggleFreightRuleForm();

  //     setInitialData({ ...customerFRInitialValues });
  //     const response = action.payload;
  //     toast.success(response.message.message);
  //     // if (response.message.code === "SUCCESS") {
  //     await dispatch(listCustomerPR({
  //       customerPR_id: props.fetchCustomer?.Id
  //     }));
  //     // console.log({ DEM: props.fetchCustomer?.Id })
  //     // }
  //   } catch (error) {
  //     toast.error("Something went wrong: ");
  //   }
  // }

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      const updatedFRFList = sortedData.map((row) => {
        const matchedItem = props.customerFR.find(
          (customerFRItem: any) => customerFRItem.Id === row.Id && customerFRItem.Product === row.Product
        );

        return {
          FRFId: row.Id,
          EffectiveDateTime: matchedItem
            ? moment.utc(matchedItem.EffectiveDateTime).local().format('YYYY-MM-DDTHH:mm')
            : moment.utc().format('YYYY-MM-DDTHH:mm'),
        };
      });

      setInitialData((prevData) => ({
        ...prevData,
        FRF_list: updatedFRFList,
      }));
      setIsInitialLoad(false);
    }
  }, [props.customerFR, sortedData, isInitialLoad]);


  const handleSubmit = async () => {
    if (selectedRows.size === 0) {
      toast.error("Please select at least one row.");
      return;
    }

    try {
      const selectedRowsData = Array.from(selectedRows).map(index => sortedData[index]);
      // const frfIdList = selectedRowsData.map(row => parseInt(row.Id, 10));

      const frfIdList = selectedRowsData.map((row) => {
        // Find the original index in sortedData
        const originalIndex = sortedData.findIndex(item => item.Id === row.Id);

        const effectiveDateTime = initialData.FRF_list[originalIndex]?.EffectiveDateTime || moment.utc().format('YYYY-MM-DDTHH:mm');

        console.log(`Original Index: ${originalIndex}, Row ID: ${row.Id}, EffectiveDateTime: ${effectiveDateTime}`);

        return {
          FRFId: parseInt(row.Id, 10),
          EffectiveDateTime: effectiveDateTime,
        };
      });
      // if (frfIdList.some(id => isNaN(id))) {
      //   throw new Error('One or more IDs are not valid integers.');
      // }

      const action = await dispatch(addCustomerFreightRule({
        CustomersFId: props.fetchCustomer.Id,
        FRF_list: frfIdList
      }));

      props.toggleFreightRuleForm();
      setInitialData({ ...customerFRInitialValues });

      const response = action.payload;
      toast.success(response.message.message);
      if (response.message.code === "SUCCESS") {
        dispatch(listCustomerFreightRule({
          customerFR_id: props.fetchCustomer.Id
        }))
      }
      // console.log(customerPR)
    } catch (error) {
      toast.error("Something went wrong: ");
    }
  };

  return (
    <>
      {freightDataLoading ? (
        <div className='' style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}>
          <FallbackLoader />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
              <Box>
                <TextValidator
                  label="Customer Name"
                  name="Symbol"
                  value={props.fetchCustomer?.DisplayName}
                  sx={{ width: '100%', }}
                  size="small"
                  variant="filled"
                  fullWidth
                />
              </Box>
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
                    size="small"
                    placeholder="Search Columns..."
                    InputProps={{
                      startAdornment: (
                        <IconButton size="small">
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                  {filteredColumns.map((column) => (
                    <MenuItem key={column.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={visibleColumns[column.key]}
                            onChange={handleColumnVisibilityChange}
                            name={column.key}
                          />
                        }
                        label={column.name}
                      />
                    </MenuItem>
                  ))}
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
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#EFEFEF' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows.size > 0 &&
                        selectedRows.size < sortedData.length
                      }
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {visibleColumns.ProductCategory && <TableCell>Product Category</TableCell>}
                  {visibleColumns.Product && <TableCell>Product</TableCell>}
                  {visibleColumns.Markup && <TableCell>Markup</TableCell>}
                  {visibleColumns.Rate && <TableCell>Rate</TableCell>}
                  {visibleColumns.Unit && <TableCell>Unit</TableCell>}
                  <TableCell>EffectiveDateTime</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onChange={() => handleRowSelect(index)}
                      />
                    </TableCell>
                    {visibleColumns.ProductCategory && <TableCell>{row.ProductCategory}</TableCell>}
                    {visibleColumns.Product && <TableCell>{row.Product}</TableCell>}

                    {visibleColumns.Markup && <TableCell>{row.Markup}</TableCell>}
                    {visibleColumns.Rate && <TableCell>{row.Rate}</TableCell>}
                    {visibleColumns.Unit && <TableCell>{row.Unit}</TableCell>}
                    <TableCell>
                      {/* <TextValidator
                        label="EffectiveDateTime"
                        name={`EffectiveDateTime-${index}`}
                        type='datetime-local'
                        value={initialData.FRF_list[index]?.EffectiveDateTime || moment.utc().format('YYYY-MM-DDTHH:mm')}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        variant="filled"
                      /> */}
                      <TextValidator
                        label="Effective Date Time"
                        name={`EffectiveDateTime-${index}`}
                        value={initialData.FRF_list[index]?.EffectiveDateTime || moment.utc().format('YYYY-MM-DDTHH:mm')}
                        type="datetime-local"
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        variant="filled"
                      />

                    </TableCell>
                  </TableRow>
                ))}
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
            <div style={{
              padding: '8px',
              textAlign: 'right',
              position: 'absolute',
              bottom: '5.2rem',
              left: '0.76rem',
              fontSize: '0.625rem'
            }}>
              {/* Selected Rows: {selectedRows.size} */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant='contained'
                sx={{ margin: '12px' }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </ValidatorForm>
        </TableContainer >
      )}
    </>
  );
};

export default CustomerFreightRule;