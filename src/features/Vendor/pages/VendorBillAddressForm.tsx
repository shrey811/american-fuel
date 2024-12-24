import { Autocomplete, Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listVendor } from 'store/slices/vendorSlice';

import { billAddressVendor, listBillAddressVendor, updateBillAddressVendor } from 'store/slices/billAddressVendorSlice';
// import { listCity } from 'store/slices/citySlice';
import { stateList } from 'store/slices/stateSlice';
import { listCityState } from 'store/slices/cityStateSlice';

interface Props {
  vendorId: string;

  toggle: () => void;
  editItem?: any;
}

const BillInitialValues = {
  Line1: '',
  Line2: '',
  Line3: '',
  Line4: '',
  Line5: '',
  StatesFId: 0,
  CitiesFId: 0,
  CountrySubDivisionCode: '',
  Country: '',
  PostalCode: '',
  Lat: '',
  Long: '',
  Note: '',
  VendorFId: '',
  IsBill: true,
  IsShip: false,
  Zip: ''
}

const VendorBillAddressForm = (props: Props) => {

  const [initialBillData, setInitialBillData] = useState<typeof BillInitialValues>({
    ...BillInitialValues,
    IsBill: true,
    IsShip: false,
  });
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    if (props.vendorId) {
      dispatch(listVendor())
      const selectedVendor = vendorList.find(item => item.Id === parseFloat(props.vendorId));
      if (selectedVendor) {
        setDisplayName(selectedVendor.DisplayName);
        console.log("selectedVendor.DisplayName  ", selectedVendor.DisplayName);
      }
    }
  }, []);

  const [vendorList, addVendorLoading] = useAppSelector(
    (state) => [
      state.vendorReducers.vendorList,
      state.vendorReducers.addVendorLoading
    ],
    shallowEqual
  );

  const dispatch = useAppDispatch();

  const [billAddressVendorListData, billAddressVendorDataLoading] = useAppSelector(
    (state) => [
      state.billAddressVendorReducers.billAddressVendorListData,
      state.billAddressVendorReducers.billAddressVendorDataLoading
    ],
    shallowEqual
  );
  const [stateListData, stateDataLoading] = useAppSelector(
    (state) => [
      state.stateReducers.stateListData,
      state.stateReducers.stateDataLoading
    ],
    shallowEqual
  );

  const [listCityies, listCityStateLoading] = useAppSelector(
    (state) => [
      state.cityStateReducers.cityStateList,
      state.cityStateReducers.listCityStateLoading
    ],
    shallowEqual
  );
  useEffect(() => {
    dispatch(listVendor())
    // dispatch(listCity())
    // dispatch(listCityState())
    dispatch(stateList())
  }, []);

  useEffect(() => {
    if (props.editItem) {
      setInitialBillData({
        ...props.editItem
      })
    } else {
      // Reset form fields if no editItem is provided
      setInitialBillData({ ...BillInitialValues });
    }
  }, [props.editItem])

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialBillData({ ...initialBillData, [name]: value });
    if (name === "StatesFId") {
      dispatch(listCityState(value))
    }
  }

  const handleEditState = () => {
    if (props.editItem) {
      return stateListData.find(item => item.Id === initialBillData.StatesFId) || null;
    } else {
      return initialBillData.StatesFId ? stateListData.find(item => item.Id === initialBillData.StatesFId) || null : null;
    }
  }

  const handleEditCity = () => {
    if (props.editItem) {
      return listCityies.find(item => item.Id === initialBillData.CitiesFId) || null;
    } else {
      return initialBillData.CitiesFId ? listCityies.find(item => item.Id === initialBillData.CitiesFId) || null : null;
    }
  }

  const handleSubmit = async () => {

    try {
      if (props.editItem) {
        const action = await dispatch(updateBillAddressVendor({
          ...initialBillData,
          VendorFId: props.vendorId,
        }))
        const response = action.payload;
        props.toggle();
        toast.success(response.message.message);
        setInitialBillData({
          ...BillInitialValues
        })
        if (response.message.code === 'SUCCESS') {
          // console.log({ vendors_id: props.vendorId })
          dispatch(listBillAddressVendor({ vendors_id: props.vendorId }))
        }
      } else {
        const action = await dispatch(billAddressVendor({
          ...initialBillData,
          VendorFId: props.vendorId,
        }))
        const response = action.payload;
        console.log({ response });
        props.toggle();
        toast.success(response.message.message);
        setInitialBillData({
          ...BillInitialValues
        })
        if (response.message.code === 'SUCCESS') {
          console.log({ vendors_id: props.vendorId })
          dispatch(listBillAddressVendor({ vendors_id: props.vendorId }))
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={4}>
            <TextValidator
              label="Vendor Name"
              // onChange={handleChange}
              name="Line1"
              value={displayName}
              size="small"
              variant="filled"
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={4}>
            <TextValidator
              label="Street 1"
              onChange={handleChange}
              name="Line1"
              value={initialBillData.Line1}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Street 2"
              onChange={handleChange}
              name="Line2"
              value={initialBillData.Line2}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={4}>
            <TextValidator
              label="Address 3"
              onChange={handleChange}
              name="Line3"
              value={initialBillData.Line3}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid> */}
          {/* <Grid item xs={4}>
            <TextValidator
              label="Address 4"
              onChange={handleChange}
              name="Line4"
              value={initialBillData.Line4}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid> */}
          {/* <Grid item xs={4}>
            <TextValidator
              label="Address 5"
              onChange={handleChange}
              name="Line5"
              value={initialBillData.Line5}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid> */}
          <Grid item xs={4}>
            <Autocomplete
              options={stateListData}
              getOptionLabel={(option) => option.Name}
              value={stateListData.find(state => state.Id === initialBillData.StatesFId)}
              onChange={(event, value) => handleChange({ target: { name: "StatesFId", value: value ? value.Id : '' } })}
              renderInput={(params) =>
                <TextField {...params} label="State" variant="filled"
                  fullWidth
                  required
                  size="small" />}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={listCityies}
              getOptionLabel={(option) => option.Name}
              value={listCityies?.find(city => city.Id === initialBillData.CitiesFId) || null}
              onChange={(event, value) => handleChange({ target: { name: "CitiesFId", value: value ? value.Id : '' } })}
              renderInput={(params) => <TextField {...params} label="City" variant="filled"
                fullWidth
                required
                size="small" />}
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Country Sub Division Code"
              onChange={handleChange}
              name="CountrySubDivisionCode"
              value={initialBillData.CountrySubDivisionCode}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Country"
              onChange={handleChange}
              name="Country"
              value={initialBillData.Country}
              // validators={['required']}
              errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Postal Code"
              onChange={handleChange}
              name="PostalCode"
              value={initialBillData.PostalCode}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Lat"
              onChange={handleChange}
              name="Lat"
              value={initialBillData.Lat}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Long"
              onChange={handleChange}
              name="Long"
              value={initialBillData.Long}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Zip"
              onChange={handleChange}
              name="Zip"
              value={initialBillData.Zip}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextValidator
              label="Note"
              onChange={handleChange}
              name="Note"
              value={initialBillData.Note}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            name="Save"
            variant='contained'
            loading={billAddressVendorDataLoading}
            disabled={billAddressVendorDataLoading}
          />
        </Grid>
      </ValidatorForm>
    </Box>
  )
}

export default VendorBillAddressForm;