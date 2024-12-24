import { Autocomplete, Grid, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { getBillAddressCustomer, listBillAddress, updateBillAddress } from 'store/slices/billaddressSlice';
import { listCityState } from 'store/slices/cityStateSlice';
import { listCustomer } from 'store/slices/customerSlice';

interface Props {
  toggleForm: () => void;
  customerId: string;
  editItem?: any;
  editData?: any;
}

const BillInitialValues = {
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
  IsBill: true,
  IsShip: false,
  Zip: '',
  StatesFId: 0,
  CitiesFId: 0,
  CustomerFId: 0
}

const CustomerBillAddressForm = (props: Props) => {

  const [initialBillData, setInitialBillData] = useState<typeof BillInitialValues>({
    ...BillInitialValues,
    CustomerFId: Number(props.customerId)
  });
  const [displayName, setDisplayName] = useState<string>('');
  const dispatch = useAppDispatch();


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

  const [customerList, addCustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.addCustomerLoading,
    ],
    shallowEqual
  );

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

  const [billAddressList, listBillAddressLoading] = useAppSelector(
    (state) => [
      state.billAddressReducers.billAddressList,
      state.billAddressReducers.listBillAddressLoading
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

  const handleChangeBill = (event: any) => {
    const { name, value } = event.target;
    setInitialBillData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (name === "StatesFId") {
      dispatch(listCityState(value))
    }
  };

  const handleSubmitBillAddress = async () => {
    try {
      if (props.editItem) {
        const action = await dispatch(updateBillAddress({
          bill_address_id: props.editItem.Id,
          ...initialBillData,
          CustomerFId: Number(props.customerId)
        }));
        setInitialBillData({ ...BillInitialValues });
        const response = action.payload;
        if (response.message.code === "FAILED") {
          toast.error(response.message.message);
        }
        
        // Redirect to CustomerViewDetails page
        props.toggleForm();   // Close the form
        if (response.message.code === 'SUCCESS') {
          toast.success(response.message.message);
          // console.log({ vendors_id: props.vendorId })
          const customerIdString = Number(props.customerId)
          dispatch(getBillAddressCustomer({ customer_bill_address_id: customerIdString }))
        } // Show the details page again
      } else {
        console.log({ initialBillData });
        const action = await dispatch(listBillAddress({ ...initialBillData, CustomerFId: Number(props.customerId) }))
        const response = action.payload;
        setInitialBillData({
          ...BillInitialValues
        })
        if (response.message.code === "FAILED") {
          toast.error(response.message.message);
        }
        props.toggleForm();
        if (response.message.code === 'SUCCESS') {
          toast.success(response.message.message);
          const customerIdString = Number(props.customerId)
          dispatch(getBillAddressCustomer({ customer_bill_address_id: customerIdString }))
        } // Show the details page again
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmitBillAddress} autoComplete="off">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={4}>
            <TextValidator
              label="Customer Name"
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
              onChange={handleChangeBill}
              name="Line1"
              value={initialBillData.Line1}
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
              onChange={handleChangeBill}
              name="Line2"
              value={initialBillData.Line2}
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
              onChange={handleChangeBill}
              name="CountrySubDivisionCode"
              value={initialBillData.CountrySubDivisionCode}
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
              onChange={handleChangeBill}
              name="Country"
              value={initialBillData.Country}
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
              onChange={handleChangeBill}
              name="PostalCode"
              value={initialBillData.PostalCode}
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
              onChange={handleChangeBill}
              name="Lat"
              value={initialBillData.Lat}
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
              onChange={handleChangeBill}
              name="Long"
              value={initialBillData.Long}
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
              onChange={handleChangeBill}
              name="Note"
              value={initialBillData.Note}
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
              onChange={handleChangeBill}
              name="Zip"
              value={initialBillData.Zip}
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
              value={stateListData.find((item: any) => item.Id === initialBillData.StatesFId) || null}
              onChange={(event, value) => handleChangeBill({ target: { name: "StatesFId", value: value ? value.Id : '' } })}
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
              value={listCityies?.find((item: any) => item.Id === initialBillData.CitiesFId) || null}
              onChange={(event, value) => handleChangeBill({ target: { name: "CitiesFId", value: value ? value.Id : '' } })}
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
            loading={listBillAddressLoading}
            disabled={listBillAddressLoading}
          />
        </Grid>
      </ValidatorForm>
    </div>
  )
}

export default CustomerBillAddressForm;