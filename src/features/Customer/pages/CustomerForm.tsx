import { Autocomplete, Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import Button from 'components/Button/Button';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { getBillAddressCustomer, listBillAddress, updateBillAddress } from 'store/slices/billaddressSlice';
import { listCityState } from 'store/slices/cityStateSlice';
import { addCustomer, listCustomer, updateCustomer } from 'store/slices/customerSlice';
import { addCustomerAssest, addProductCustomerAssest, listCustomerAssest, updateCustomerAssest } from 'store/slices/customerassestsSlice';
import { listProductCategory } from 'store/slices/productCategorySlice';
import { listShipAddress, updateShipAddress } from 'store/slices/shipaddressSlice';
import { stateList } from 'store/slices/stateSlice';
import { TabStyles } from './styles';
import CustomerBillAddressList from './CustomerBillAddressList';
import CustomerShipAddressList from './CustomerShipAddressList';
import GeneralModal from 'components/UI/GeneralModal';
import CustomerBillAddressForm from './CustomerBillAddressForm';
import CustomerShipAddressForm from './CustomerShipAddressForm';
import { listCity } from 'store/slices/citySlice';

interface Props {
  editData?: any
  setEditData?: any
  toggleForm: () => void;
  toggleDetails?: any;
}

const CustomerInitialValues = {
  GivenName: "",
  MiddleName: "",
  FamilyName: "",
  PrimaryPhone: "",
  AlternatePhone: "",
  Mobile: "",
  Email: "",
  Other: "",
  DisplayName: '',
  Active: true,
}

const BillInitialValues = {
  Line1: '',
  Line2: '',
  Line3: '',
  Line4: '',
  Line5: '',
  City: '',
  CountrySubDivisionCode: '',
  Country: '',
  PostalCode: '',
  Lat: '',
  Long: '',
  IsBill: true,
  IsShip: true,
  Note: '',
  Zip: '',
  StatesFId: 0,
  Id: 0,
  CitiesFId: 0,
  CustomerFId: 0
}

const ShipInitialValues = {
  Line1: '',
  Line2: '',
  Line3: '',
  Line4: '',
  Line5: '',
  City: '',
  CountrySubDivisionCode: '',
  Country: '',
  PostalCode: '',
  Lat: '',
  Long: '',
  Note: '',
  Zip: '',
  IsBill: true,
  IsShip: true,
  IntuitId: '',
  StatesFId: 0,
  CitiesFId: 0,
  CustomerFId: 0
}

const CustomerAssetsInitialValues = {
  Name: '',
  UniqueId: '',
  AssetType: '',
  ErpId: '',
  Status: '',
  CustomersFId: 0
}

const ProductInitialValues = {
  CustomersAssetFId: 0,
  ProductsFId: 0,
  CustomerFId: 0
}

const CustomerForm = (props: Props) => {
  const dispatch = useAppDispatch();

  const [tabIndex, setTabIndex] = useState(0);
  const [displayName, setDisplayName] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerDetails, setCustomerDetails] = useState<number | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState('');
  const [openBillModal, setOpenBillModal] = useState(false);
  const [openShipModal, setOpenShipModal] = useState(false);
  const handleTabChange = (event: any, newValue: number) => {


    setTabIndex(newValue);
  };
  const [initialData, setInitialData] = useState<typeof CustomerInitialValues>({
    ...CustomerInitialValues
  });

  const [initialBillData, setInitialBillData] = useState<typeof BillInitialValues>({
    ...BillInitialValues
  });

  const [initialShipData, setInitialShipData] = useState<typeof ShipInitialValues>({
    ...ShipInitialValues
  });

  const [initialCustomerAssestData, setCustomerAssData] = useState<typeof CustomerAssetsInitialValues>({
    ...CustomerAssetsInitialValues
  })

  const [initialProductData, setInitialProductData] = useState<typeof ProductInitialValues>({
    ...ProductInitialValues
  })

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({
      ...initialData, [name]: value
    });
  }

  const [customerList, addCustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.addCustomerLoading,
    ],
    shallowEqual
  );

  const [billAddressList, listBillAddressLoading] = useAppSelector(
    (state) => [
      state.billAddressReducers.billAddressList,
      state.billAddressReducers.listBillAddressLoading
    ],
    shallowEqual
  );

  const [customerAssestList, listCustomerAssestLoading] = useAppSelector(
    (state) => [
      state.customerAssestReducers.customerAssestList,
      state.customerAssestReducers.listCustomerAssestLoading
    ],
    shallowEqual
  );
  console.log({ customerAssestList });

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

  const [productCategoryList, listProductCategoryLoading] = useAppSelector(
    (state) => [
      state.productCategoryReducers.productCategoryList,
      state.productCategoryReducers.listProductCategoryLoading,
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(listCustomer());
    dispatch(listProductCategory());
    dispatch(stateList());
    dispatch(listCity());
    // dispatch(listCustomerAssest());
  }, []);


  useEffect(() => {
    if (props.editData) {
      setInitialData(props.editData);
      const { Id, ...rest } = props.editData;
      console.log("check", Id);
      setSelectedCustomerId(props.editData.Id);
      dispatch(listCustomerAssest({ customerAssest_id: Id }));
      // Set bill address data if available
      if (props.editData.Bill_address && props.editData.Bill_address.length > 0) {
        setInitialBillData(props.editData.Bill_address[0]); // Assuming you're only setting the first bill address
      } else {
        // If no bill address data is provided, reset initialBillData to empty values
        setInitialBillData({ ...BillInitialValues });
      }

      // Set ship address data if available
      if (props.editData.Ship_address && props.editData.Ship_address.length > 0) {
        setInitialShipData(props.editData.Ship_address[0]); // Assuming you're only setting the first ship address
      } else {
        // If no ship address data is provided, reset initialShipData to empty values
        setInitialShipData({ ...ShipInitialValues });
      }

      if (props.editData.Customer_assets && props.editData.Customer_assets.length > 0) {
        setCustomerAssData(props.editData.Customer_assets[0]);
        // Assuming you're only setting the first customer asset
      } else {
        // If no customer asset data is provided, reset initialCustomerAssestData to empty values
        setCustomerAssData({ ...CustomerAssetsInitialValues });
      }


    }
  }, [props.editData]);




  useEffect(() => {
    if (submissionCompleted) {
      const customer_id = customerDetails;
      if (customer_id && !isNaN(customer_id)) {
        dispatch(listCustomer())

        const selectedCustomer = customerList.find(item => item.Id === customer_id);
        console.log(customer_id); // Ensure this is not empty or undefined
        console.log(customer_id); // Ensure it has the expected value and type
        console.log(selectedCustomer); // This should give more insight

        console.log("selectedVendor 12 ", selectedCustomer);

        if (selectedCustomer) {
          setDisplayName(selectedCustomer.DisplayName);
          console.log("selectedVendor.DisplayName  ", selectedCustomer.DisplayName);
        }

        const vendorIdString = customer_id.toString();
        setSelectedCustomerId(vendorIdString);
        dispatch(getBillAddressCustomer({ customer_id: customer_id }));


      }


      // Reset the state to avoid repeated calls
      setSubmissionCompleted(false);
    }

    dispatch(listCustomer())
  }, [submissionCompleted, customerDetails, dispatch]);

  useEffect(() => {
    if (props.editData) {
      setDisabledButton(false)
    }
  }, [])

  const handleSubmit = async () => {
    try {
      let response;
      if (props.editData) {
        console.log({ PROPSEDITDATA: props.editData });

        const action = await dispatch(updateCustomer({
          customer_id: props.editData.Id,
          ...initialData
        }));

        console.log({ action });

        response = action.payload;

        // Check if the response contains the expected structure
        if (response.message && response.message.message) {
          toast.success(response.message.message);
        } else {
          throw new Error("Unexpected response structure");
        }

        // Reset the form
        setInitialData({ ...CustomerInitialValues });
        props.setEditData(null);

        // Redirect to CustomerViewDetails page
        // props.toggleForm();   // Close the form
        // props.toggleDetails(); // Show the details page again
      } else {
        const action = await dispatch(addCustomer(initialData));
        response = action.payload;
        const customerID = response.message.data;
        setCustomerDetails(customerID);
        setSubmissionCompleted(true);
        // Check if the response contains the expected structure
        if (response.message && response.message.message) {
          toast.success(response.message.message);
        } else {
          throw new Error("Unexpected response structure");
        }

        // Reset the form
        setInitialData({ ...CustomerInitialValues });
        setDisabledButton(false)

        // Redirect to CustomerList page
        // props.toggleForm();  // Close the form and show the list page
      }
      setDisabled(true);
    } catch (error) {
      console.error("Error in handleSubmit:", error); // Log the error for debugging
      toast.error("Something went wrong");
    }
  };

  const openBillAddressModal = () => {
    setOpen(true);
    setSelectedForm('bill');
    setEditItem(null)
  };

  const openShipAddressModal = () => {
    setOpen(true);
    setSelectedForm('ship');
    setEditItem(null)
  };

  // const toggleForm = () => {
  //   setEditItem(null)
  //   setOpen(true);
  // };

  // const resetEditItem = () => {
  //   setEditItem(null);
  // };


  // if (addCustomerLoading) {
  //   return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /></div>
  // }

  return (
    <Box>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={1} mt={1}>
          {/* <Grid item xs={12} sm={4}>
            <TextValidator
              label="First Name"
              onChange={handleChange}
              name="GivenName"
              value={initialData.GivenName}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Middle Name"
              onChange={handleChange}
              name="MiddleName"
              value={initialData.MiddleName}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Family Name"
              onChange={handleChange}
              name="FamilyName"
              value={initialData.FamilyName}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Display Name *"
              onChange={handleChange}
              name="DisplayName"
              value={initialData.DisplayName}
              disabled={disabled}
              validators={['required']}
              errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Primary Phone *"
              onChange={handleChange}
              name="PrimaryPhone"
              value={initialData.PrimaryPhone}
              disabled={disabled}
              validators={['required']}
              errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Email"
              onChange={handleChange}
              name="Email"
              value={initialData.Email}
              type='email'
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Alternate Phone"
              onChange={handleChange}
              name="AlternatePhone"
              value={initialData.AlternatePhone}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Mobile"
              onChange={handleChange}
              name="Mobile"
              value={initialData.Mobile}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Other"
              onChange={handleChange}
              name="Other"
              value={initialData.Other}
              disabled={disabled}
              // validators={['required']}
              // errorMessages={['This field is required']}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            name="Confirm"
            variant='contained'
            loading={addCustomerLoading}
            disabled={addCustomerLoading}
          />
        </Grid>
      </ValidatorForm>

      <Divider sx={{ my: 2, py: 3 }} />
      {/* SIGNLE BILL ADDRESS FORM START */}

      {/* <Box>
        <Grid container spacing={2} alignItems="center" mt={5}>

          <Grid item xs={12} sm={9}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab
                label="Bill Address"
                sx={{
                  textAlign: 'left',
                  backgroundColor: tabIndex === 0 ? '#1976d2' : 'transparent',
                  color: tabIndex === 0 ? '#FFFFFF !important' : 'inherit',
                }}
              />
              <Tab
                label="Ship Address"
                sx={{
                  textAlign: 'left',
                  backgroundColor: tabIndex === 1 ? '#1976d2' : 'transparent',
                  color: tabIndex === 1 ? '#FFFFFF !important' : 'inherit',
                }}
              />
            </Tabs>
          </Grid>
          <Grid item xs={12} sm={3} container justifyContent="flex-end">
            {tabIndex === 0 ? (
              <Button variant="contained" disabled={disabledButton} onClick={openBillAddressModal}>
                Add Bill Address
              </Button>
            ) : (
              <Button variant="contained" disabled={disabledButton} onClick={openShipAddressModal}>
                Add Ship Address
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>

          <Box sx={{ display: tabIndex === 0 ? 'block' : 'none', mt: 2 }}>
            <GeneralModal open={open} handleClose={() => { setOpen(false); setSelectedForm(''); }} title={selectedForm === 'bill' ? 'Add Bill Address' : 'Add Ship Address'}>
              {selectedForm === 'bill' ? (
                <CustomerBillAddressForm
                  editData={props.editData}
                  customerId={selectedCustomerId}
                  editItem={editItem}

                  toggleForm={() => setOpen(false)}
                />
              ) : (
                <CustomerShipAddressForm
                  customerId={selectedCustomerId}
                  toggleForm={() => setOpen(false)}
                />
              )}
            </GeneralModal>
            <CustomerBillAddressList editData={props.editData} editItem={editItem} customerId={selectedCustomerId} />
          </Box>


          <Box sx={{ display: tabIndex === 1 ? 'block' : 'none', mt: 2 }}>
            <GeneralModal open={open} handleClose={() => { setOpen(false); setSelectedForm(''); }} title={selectedForm === 'ship' ? 'Add Ship Address' : 'Add Bill Address'}>
              {selectedForm === 'ship' ? (
                <CustomerShipAddressForm
                  editData={props.editData}
                  customerId={selectedCustomerId}
                  toggleForm={() => setOpen(false)}
                />
              ) : (
                <CustomerBillAddressForm
                  customerId={selectedCustomerId}
                  toggleForm={() => setOpen(false)}
                />
              )}
            </GeneralModal>
            <CustomerShipAddressList
              editData={props.editData}
              editItem={editItem} customerId={selectedCustomerId} />
          </Box>
        </Grid>
      </Box> */}


      <Box>
        <Grid container spacing={2} alignItems="center" mt={5}>
          {/* Add Bill Address Button */}
          <Grid item xs={12} sm={12} container justifyContent="flex-end">
            <Button variant="contained" disabled={disabledButton} onClick={() => setOpenBillModal(true)}>
              Add Bill Address
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12}>
          {/* Billing Address Content */}
          <Box sx={{ mt: 2 }}>
            <GeneralModal
              open={openBillModal}
              handleClose={() => { setOpenBillModal(false); setSelectedForm(''); }}
              title="Add Bill Address"
            >
              <CustomerBillAddressForm
                editData={props.editData}
                customerId={selectedCustomerId}
                editItem={editItem}
                toggleForm={() => setOpenBillModal(false)}
              />
            </GeneralModal>

            <CustomerBillAddressList
              editData={props.editData}
              editItem={editItem}
              customerId={selectedCustomerId}
            />
          </Box>
        </Grid>

        <Grid container spacing={2} alignItems="center" mt={5}>
          {/* Add Ship Address Button */}
          <Grid item xs={12} sm={12} container justifyContent="flex-end">
            <Button variant="contained" disabled={disabledButton} onClick={() => setOpenShipModal(true)}>
              Add Ship Address
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12}>
          {/* Shipping Address Content */}
          <Box sx={{ mt: 2 }}>
            <GeneralModal
              open={openShipModal}
              handleClose={() => { setOpenShipModal(false); setSelectedForm(''); }}
              title="Add Ship Address"
            >
              <CustomerShipAddressForm
                customerId={selectedCustomerId}
                toggleForm={() => setOpenShipModal(false)}
              />
            </GeneralModal>

            <CustomerShipAddressList
              editData={props.editData}
              editItem={editItem}
              customerId={selectedCustomerId}
            />
          </Box>
        </Grid>
      </Box>


    </Box >
  )
}

export default CustomerForm;