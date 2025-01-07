import { Autocomplete, Box, Grid, MenuItem, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { Label } from 'reactstrap';
import { listProduct } from 'store/slices/productSlice';
import { addRealTimeCost, listRealTimeCost, updateRealTimeCost } from 'store/slices/realtimecostSlice';
import { listAllTerminal } from 'store/slices/terminalSlice';
import { listVendor } from 'store/slices/vendorSlice';

interface Props {
  editData?: any;
  setEditData?: any;
  backToList?: any;
}

const RealTimeInitialValues = {
  EffectiveDateTime: '',
  Cost: 0,
  CostType: '',
  VendorsFId: 0,
  TerminalsFId: 0,
  ProductsFId: '',
  SupplyFId: 0,
};

const RealTimeForm = (props: Props) => {
  const [initialData, setInitialData] = useState<typeof RealTimeInitialValues>({
    ...RealTimeInitialValues,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listVendor());
    dispatch(listProduct());
    dispatch(listAllTerminal()); // Fetch terminal list independently
  }, []);

  const [realtimeList, addRealTimeLoading] = useAppSelector(
    (state) => [
      state.realtimeReducers.realtimeList,
      state.realtimeReducers.addRealTimeLoading,
    ],
    shallowEqual
  );

  const [vendorList, listVendorLoading] = useAppSelector(
    (state) => [
      state.vendorReducers.vendorList,
      state.vendorReducers.listVendorLoading,
    ],
    shallowEqual
  );

  useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
        EffectiveDateTime: moment.utc(props.editData.EffectiveDateTime).format('MM/DD/YYYY HH:mm:ss'),
      });
    } else {
      setInitialData(RealTimeInitialValues);
    }
  }, [props.editData]);

  const [productList, listProductLoading] = useAppSelector(
    (state) => [
      state.productReducers.productList,
      state.productReducers.listProductLoading,
    ],
    shallowEqual
  );

  const [terminalListData, terminalDataLoading] = useAppSelector(
    (state) => [
      state.terminalReducers.terminalListData,
      state.terminalReducers.terminalDataLoading,
    ],
    shallowEqual
  );

  console.log({ vendorList, productList, terminalListData });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
    if (name === 'VendorsFId') {
      setInitialData({
        ...initialData,
        [name]: value,
        SupplyFId: value, // Set SupplyFId to the selected vendor id (value)
      });
    } else {
      setInitialData({ ...initialData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (props.editData) {
        const action = await dispatch(updateRealTimeCost({
          product_realtime_cost_id: props.editData.Id,
          ...initialData,

          EffectiveDateTime: moment.utc(initialData.EffectiveDateTime).format() // Convert to string

        }));
        const response = action.payload;
        setInitialData({ ...RealTimeInitialValues });
        props.setEditData(null);
        toast.success(response.message.message);
        props.backToList();
        if (response.message.code === 'SUCCESS') {
          dispatch(listRealTimeCost());
        }
      } else {
        const action = await dispatch(addRealTimeCost({
          ...initialData,
          SupplyFId: initialData.VendorsFId,
          EffectiveDateTime: moment.utc(initialData.EffectiveDateTime).format() // Convert to string
        }));
        const response = action.payload;
        setInitialData({ ...RealTimeInitialValues });
        toast.success(response.message.message);
        props.backToList();
        if (response.message.code === 'SUCCESS') {
          dispatch(listRealTimeCost());
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditVendor = () => {
    if (props.editData) {
      return vendorList.find((item) => item.Id === initialData.VendorsFId) || null;
    } else {
      return initialData.VendorsFId ? vendorList.find((item) => item.Id === initialData.VendorsFId) || null : null;
    }
  };

  const handleEditTerminal = () => {
    if (props.editData) {
      return terminalListData.find((item) => item.Id === initialData.TerminalsFId) || null;
    } else {
      return initialData.TerminalsFId ? terminalListData.find((item) => item.Id === initialData.TerminalsFId) || null : null;
    }
  };

  return (
    <Box>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {/* <Autocomplete
              options={vendorList}
              getOptionLabel={(option) => option.DisplayName}
              value={handleEditVendor()}
              onChange={(event, value) => handleChange({ target: { name: 'VendorsFId', value: value ? value.Id : '' } })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vendor name"
                  variant="filled"
                  size="small"
                  onChange={handleChange}
                  value={initialData.VendorsFId}
                  name="VendorsFId"
                />
              )}
            /> */}
            <Autocomplete
              options={vendorList}
              getOptionLabel={(option) => option.DisplayName}
              value={handleEditVendor()}
              onChange={(event, value) => handleChange({ target: { name: 'VendorsFId', value: value ? value.Id : '' } })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier name"
                  variant="filled"
                  size="small"
                  onChange={handleChange}
                  value={initialData.VendorsFId}
                  name="VendorsFId"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={terminalListData}
              // getOptionLabel={(option) => option.Name}

              getOptionLabel={(option) => `${option.Name} (${option.Number})`}
              value={handleEditTerminal()}
              filterOptions={(options, { inputValue }) => {
                const lowerCaseInput = inputValue.toLowerCase();
                const filtered = options.filter(
                  (option) =>
                    option.Name.toLowerCase().startsWith(lowerCaseInput) ||
                    option.Number.toLowerCase().startsWith(lowerCaseInput)
                );
                return filtered;
              }}

              onChange={(event, value) => {
                // Update TerminalsFId and address state
                handleChange({ target: { name: "TerminalsFId", value: value ? value.Id : '' } });

              }}
              renderInput={(params) => <TextField
                {...params}
                label="Terminal name"
                variant="filled"
                size="small"
                required
                onChange={handleChange}
                value={initialData.TerminalsFId}
                name="TerminalsFId" />
              }
            // style={{ marginTop: '9px' }}

            // value={handleEditTerminal()}
            // onChange={(event, value) => handleChange({ target: { name: 'TerminalsFId', value: value ? value.Id : '' } })}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     label="Terminal name"
            //     variant="filled"
            //     size="small"
            //     onChange={handleChange}
            //     value={initialData.TerminalsFId}
            //     name="TerminalsFId"
            //   />
            // )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              select
              label="Product Name"
              name="ProductsFId"
              value={initialData.ProductsFId}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            >
              {productList.map((item) => (
                <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ marginTop: '20px' }}>
            <TextValidator
              fullWidth
              label="Cost"
              name="Cost"
              value={initialData.Cost}
              size="small"
              validators={['required']}
              errorMessages={['this field is required']}
              onChange={handleChange}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ marginTop: '20px' }}>
            <TextValidator
              select
              label="Cost-Type"
              name="CostType"
              value={initialData.CostType}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            >
              <MenuItem value="Net">Net</MenuItem>
              <MenuItem value="Gross">Gross</MenuItem>
            </TextValidator>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Label>Effective Data Time</Label>
            <TextValidator
              fullWidth
              name="EffectiveDateTime"
              value={initialData.EffectiveDateTime}
              type="datetime-local"
              size="small"
              validators={['required']}
              errorMessages={['This field is required']}
              onChange={handleChange}
              variant="filled"
            />
          </Grid>
          <Grid container justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              name="Save"
              variant="contained"
              loading={addRealTimeLoading}
              disabled={addRealTimeLoading}
            />
          </Grid>
        </Grid>
      </ValidatorForm>
    </Box>
  );
};

export default RealTimeForm;