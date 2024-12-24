import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Grid
} from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import GeneralModal from 'components/UI/GeneralModal';
import { addTaxRate, listTaxRate } from 'store/slices/taxRateSlice';
import { RootState } from 'store/store';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import { listAccount } from 'store/slices/accountSlice';

interface TaxModalProps {
  open: boolean;
  handleClose: () => void;
  rowData: any;
}

const taxRateInitialValues = {
  TaxesFId: 0,
  TaxesRateList: [
    {
      Rate: 0,
      UnitType: '',
      Unit: '',
      EffectiveDateTime: '',
    }
  ]
};

const TaxModal: React.FC<TaxModalProps> = ({ open, handleClose, rowData }) => {
  const dispatch = useAppDispatch();
  console.log("rowData", rowData);

  const [dataTable, setDataTable] = useState<{
    EffectiveDateTime: string, Rate: number, UnitType: string, Unit: string,
  }[]>([]);
  const [newRowData, setNewRowData] = useState<{ EffectiveDateTime: string, Rate: number, UnitType: string, Unit: string }>({
    EffectiveDateTime: '',
    Rate: 0,
    UnitType: 'Gallon',
    Unit: 'Per Gallon'
  });

  useEffect(() => {
    if (open) {
      dispatch(listTaxRate(rowData.Id));
      dispatch(listAccount());
    }
  }, [open]);

  const [taxRateList, listTaxRateLoading] = useAppSelector(
    (state) => [
      state.taxRateReducers.taxRateList,
      state.taxRateReducers.listTaxRateLoading
    ],
    shallowEqual
  );

  const [accountListData, listAccountLoading] = useAppSelector(
    (state) => [
      state.accountReducers.accountListData,
      state.accountReducers.listAccountLoading
    ],
    shallowEqual
  );


  useEffect(() => {
    if (taxRateList) {
      setDataTable(taxRateList.map((rate: any) => ({
        EffectiveDateTime: rate.EffectiveDateTime,
        Rate: rate.Rate,
        UnitType: rate.UnitType,
        Unit: rate.Unit
      })));
    }
  }, [taxRateList]);

  const addRow = () => {
    if (newRowData.EffectiveDateTime && newRowData.Rate !== 0) {
      setDataTable([...dataTable, newRowData]);
      setNewRowData({ EffectiveDateTime: '', Rate: 0, UnitType: '', Unit: '' });
    }
  };

  const removeRow = (index: number) => {
    const updatedRows = [...dataTable];
    updatedRows.splice(index, 1);
    setDataTable(updatedRows);
  };

  const handleSave = () => {
    let updatedDataTable = [...dataTable];

    // Check if newRowData is not empty and add it to the dataTable
    if (newRowData.EffectiveDateTime && newRowData.Rate !== 0) {
      updatedDataTable = [...updatedDataTable, newRowData];
    }

    const payload = {
      TaxesFId: rowData.Id,
      TaxesRateList: updatedDataTable,
    };

    dispatch(addTaxRate(payload));
    setDataTable([]);
    setNewRowData({ EffectiveDateTime: '', Rate: 0, UnitType: 'Gallon', Unit: 'Per Gallon' });
    handleClose();
  };

  const handleCloseAndClear = () => {
    setDataTable([]);
    setNewRowData({ EffectiveDateTime: '', Rate: 0, UnitType: 'Gallon', Unit: 'Per Gallon' });
    handleClose();
  };

  const productCategory = rowData?.ProductsDetails?.[0]?.ProductCategory || 'ALL';
  const product = rowData?.ProductsDetails?.[0]?.Product || 'ALL';


  const PAIncomeValue = rowData ? accountListData.find(item => item.Id === rowData.PA_Income_FId) : null;
  const PAIncome = PAIncomeValue ? `${PAIncomeValue.Name}` : 'ALL';

  const PAExpenseValue = rowData ? accountListData.find(item => item.Id === rowData.PA_Expense_FId) : null;
  const PAExpense = PAExpenseValue ? `${PAExpenseValue.Name}` : 'ALL';

  // console.log("PAIncome", PAIncome);

  // const PAExpense = accountListData.find(item => item.Id === rowData.PA_Expense_FId) || 'null';

  return (
    <GeneralModal handleClose={handleCloseAndClear} open={open} title={rowData?.Name}>
      <Box sx={{ width: '650px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Tax Type: {rowData?.Type ? rowData.Type : 'ALL'}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              State Name: {rowData?.StateName ? rowData.StateName : 'ALL'}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Code: {rowData?.Code ? rowData.Code : 'ALL'}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Income Account: {PAIncome}
            </Typography>


          </Box>
          <Box sx={{ flex: 1, ml: 30 }}>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              City Name: {rowData?.CityName ? rowData.CityName : 'ALL'}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Products Category: {productCategory}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Products: {product}
            </Typography>
            <Typography color="text.primary" sx={{ mb: 2 }}>
              Expense Account: {PAExpense}
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 1 }}>Effective DateTime</TableCell>
                <TableCell sx={{ py: 1 }}>Rate</TableCell>
                <TableCell sx={{ py: 1 }}>Unit Type</TableCell>
                <TableCell sx={{ py: 1 }}>Unit</TableCell>
                <TableCell sx={{ py: 1 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTable.map((row, index) => (
                <TableRow key={index} sx={{ py: 1 }}>
                  <TableCell sx={{ py: 1 }}>{row.EffectiveDateTime}</TableCell>
                  <TableCell sx={{ py: 1 }}>{row.Rate}</TableCell>
                  <TableCell sx={{ py: 1 }}>{row.UnitType}</TableCell>
                  <TableCell sx={{ py: 1 }}>{row.Unit}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => removeRow(index)}
                      variant="outlined"
                      color="primary"
                      size='small'
                      startIcon={<Delete />}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField
                    value={newRowData.EffectiveDateTime}
                    onChange={(e) => setNewRowData({ ...newRowData, EffectiveDateTime: e.target.value })}
                    variant="outlined"
                    type="datetime-local"
                    fullWidth
                    size="small"
                    placeholder="Enter Effective DateTime"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newRowData.Rate}
                    onChange={(e) => setNewRowData({ ...newRowData, Rate: Number(e.target.value) })}
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Enter Rate"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newRowData.UnitType}
                    onChange={(e) => setNewRowData({ ...newRowData, UnitType: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Enter Unit Type"
                    disabled
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.8)',  // Darker text color
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',  // Optional: Darker background
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newRowData.Unit}
                    onChange={(e) => setNewRowData({ ...newRowData, Unit: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Enter Unit"
                    disabled
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.8)',  // Darker text color
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',  // Optional: Darker background
                      }
                    }}

                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={addRow}
                    variant="outlined"
                    color="primary"
                    size='small'
                    startIcon={<AddCircle />}
                  >
                    Add Row
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  );
};

export default TaxModal;
