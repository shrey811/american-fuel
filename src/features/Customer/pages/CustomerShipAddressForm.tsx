import { Autocomplete, Grid, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listBillAddress } from 'store/slices/billaddressSlice';
import { listCityState } from 'store/slices/cityStateSlice';
import { listCustomer } from 'store/slices/customerSlice';
import { getShipAddressCustomer, listShipAddress, updateShipAddress } from 'store/slices/shipaddressSlice';

interface Props {
  toggleForm: () => void;
  customerId: string;
  editItem?: any;
  editData?: any;
}

const ShipInitialValues = {
  Line1: '',
  Line2: '',
  Line3: '',
  Line4: '',
  Line5: '',
  CountrySubDivisionCode: '',
  Country: '',
  PostalCode: '',
  Lat: '',
  Long: '',
  Note: '',
  IsBill: false,
  IsShip: true,
  Zip: '',
  StatesFId: 0,
  CitiesFId: 0,
  CustomerFId: 0
}

const CustomerShipAddressForm = (props: Props) => {

  const [initialShipData, setinitialShipData] = useState<typeof ShipInitialValues>({
    ...ShipInitialValues,
    CustomerFId: Number(props.customerId)
  });
  const [displayName, setDisplayName] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (props.editItem) {
      setinitialShipData({
        ...props.editItem
      })
    } else {
      // Reset form fields if no editItem is provided
      setinitialShipData({ ...ShipInitialValues });
    }
  }, [props.editItem])

  useEffect(() => {
    if (props.customerId) {
      dispatch(listCustomer())
      const selectedCustomer = customerList.find(item => item.Id === parseFloat(props.customerId));
      if (selectedCustomer) {
        setDisplayName(selectedCustomer.DisplayName);
        console.log("selectedVendor.DisplayName  ", selectedCustomer.DisplayName);
      }
    }
  }, []);

  const [shipAddressList, listShipAddressLoading] = useAppSelector(
    (state) => [
      state.shipAddressReducers.shipAddressList,
      state.shipAddressReducers.listShipAddressLoading
    ],
    shallowEqual
  );

  const [customerList, addCustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.addCustomerLoading,
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

  const handleChangeShip = (event: any) => {
    const { name, value } = event.target;
    setinitialShipData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (name === "StatesFId") {
      dispatch(listCityState(value))
    }
  };

  const handleSubmitShipAddress = async () => {
    try {
      if (props.editItem) {
        const action = await dispatch(updateShipAddress({
          bill_address_id: props.editItem.Id,
          ...initialShipData,
          CustomerFId: Number(props.customerId)
        }));
        setinitialShipData({ ...ShipInitialValues });
        const response = action.payload;
        if (response.message.code === "FAILED") {
          toast.error(response.message.message);
        }
        // props.setEditData(null);
        // Redirect to CustomerViewDetails page
        if (response.message.code === 'SUCCESS') {
          toast.success(response.message.message);
          // console.log({ vendors_id: props.vendorId })
          const customerIdString = Number(props.customerId)
          dispatch(getShipAddressCustomer({ customer_ship_address_id: customerIdString }))
        } // 
        props.toggleForm();   // Close the form
        // props.toggleDetails(); // Show the details page again
      } else {
        console.log({ initialShipData });
        const action = await dispatch(listShipAddress({ ...initialShipData, CustomerFId: Number(props.customerId) }))
        const response = action.payload;
        setinitialShipData({
          ...ShipInitialValues,
          // CustomerFId: props.customerId,
        })
        if (response.message.code === "FAILED") {
          toast.error(response.message.message);
        }
        if (response.message.code === 'SUCCESS') {
          toast.success(response.message.message);
          // console.log({ vendors_id: props.vendorId })
          const customerIdString = Number(props.customerId)
          dispatch(getShipAddressCustomer({ customer_ship_address_id: customerIdString }))
        } // 
        props.toggleForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmitShipAddress} autoComplete="off">
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
          <Grid item xs={3} sm={4}>

            <TextValidator
              label="Street 1"
              onChange={handleChangeShip}
              name="Line1"
              value={initialShipData.Line1}
              size="small"
              variant="filled"
              fullWidth
            // validators={['required']}
            // errorMessages={['This field is required']}
            />
          </Grid>
          <Grid item xs={3} sm={4}>

            <TextValidator
              label="Street 2"
              onChange={handleChangeShip}
              name="Line2"
              value={initialShipData.Line2}
              size="small"
              variant="filled"
              fullWidth
            // validators={['required']}
            // errorMessages={['This field is required']}
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Country Sub Division Code"
              onChange={handleChangeShip}
              name="CountrySubDivisionCode"
              value={initialShipData.CountrySubDivisionCode}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Country"
              onChange={handleChangeShip}
              name="Country"
              value={initialShipData.Country}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Postal Code"
              onChange={handleChangeShip}
              name="PostalCode"
              value={initialShipData.PostalCode}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Lat"
              onChange={handleChangeShip}
              name="Lat"
              value={initialShipData.Lat}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Long"
              onChange={handleChangeShip}
              name="Long"
              value={initialShipData.Long}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Note"
              onChange={handleChangeShip}
              name="Note"
              value={initialShipData.Note}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>

          <Grid item xs={3} sm={4}>
            <TextValidator
              label="Zip"
              onChange={handleChangeShip}
              name="Zip"
              value={initialShipData.Zip}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sm={4}>
            <Autocomplete
              options={stateListData}
              getOptionLabel={(option) => option.Name}
              value={stateListData.find((item: any) => item.Id === initialShipData.StatesFId) || null}
              onChange={(event, value) => handleChangeShip({ target: { name: "StatesFId", value: value ? value.Id : '' } })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  variant="filled"
                  fullWidth
                  size="small"
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={2} sm={4}>
            <Autocomplete
              options={listCityies}
              getOptionLabel={(option) => option.Name}
              value={listCityies?.find((item: any) => item.Id === initialShipData.CitiesFId) || null}
              onChange={(event, value) => handleChangeShip({ target: { name: "CitiesFId", value: value ? value.Id : '' } })}
              renderInput={(params) => <TextField {...params} label="City" variant="filled"
                fullWidth size="small" required />}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            name="Save"
            variant='contained'
            loading={listShipAddressLoading}
            disabled={listShipAddressLoading}
          />
        </Grid>
      </ValidatorForm>
    </div>
  )
}

export default CustomerShipAddressForm;