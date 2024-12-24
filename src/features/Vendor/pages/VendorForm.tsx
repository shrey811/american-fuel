import { Box, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listVendor, vendorAdd, vendorPut } from 'store/slices/vendorSlice';
import { listCity } from 'store/slices/citySlice';
import { bodyStyles } from './styles';
import GeneralModal from 'components/UI/GeneralModal';
import VendorBillAddressForm from './VendorBillAddressForm';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { deleteBillAddress, listBillAddressVendor } from 'store/slices/billAddressVendorSlice';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

interface Props {
  toggleForm?: any;
  editVendorDetails?: any;
  setEditVendorDetails?: any;
}

const VendorInitialValues = {
  GivenName: '',
  MiddleName: '',
  FamilyName: '',
  DisplayName: '',
  PrimaryPhone: '',
  PrimaryEmail: '',
  Domain: '',
  AccountNumber: '',
  CompanyName: '',
  WebAddress: '',
  Active: true,
  Balance: 0
}

const VendorForm = (props: Props) => {

  const [initialData, setInitialData] = useState<typeof VendorInitialValues>({
    ...VendorInitialValues
  })

  const [open, setOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [editItem, setEditItem] = useState<any>(null);
  const [vendorDetails, setVendorDetails] = useState<number | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("selectedVendorId", vendorDetails);

  const dispatch = useAppDispatch();

  const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();

  const [vendorList, addVendorLoading] = useAppSelector(
    (state) => [
      state.vendorReducers.vendorList,
      state.vendorReducers.addVendorLoading
    ],
    shallowEqual
  );

  const [billAddressVendorListData, billAddressVendorDataLoading] = useAppSelector(
    (state) => [
      state.billAddressVendorReducers.billAddressVendorListData || [],
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

  const findStateName = (stateId: any) => {
    const state = stateListData.find(item => item.Id === stateId);
    return state ? state.Name : '';
  };

  const findCityName = (cityId: any) => {
    const city = listCityies.find(item => item.Id === cityId);
    return city ? city.Name : '';
  };

  useEffect(() => {
    if (props.editVendorDetails) {
      setInitialData(props.editVendorDetails);
      setSelectedVendorId(props.editVendorDetails.Id);
    }
  }, [props.editVendorDetails]);


  useEffect(() => {
    if (props.editVendorDetails) {
      setDisabledButton(false)
    }
  }, [])
  useEffect(() => {
    setLoading(true);
    if (props.editVendorDetails) {
      const vendors_id = props.editVendorDetails.Id;
      dispatch(listBillAddressVendor({ vendors_id }))
        .finally(() => setLoading(false));
    }
  }, [props.editVendorDetails, dispatch]);


  useEffect(() => {
    if (submissionCompleted) {
      const vendors_id = vendorDetails;
      if (vendors_id && !isNaN(vendors_id)) {
        dispatch(listVendor())

        const selectedVendor = vendorList.find(item => item.Id === vendors_id);
        console.log(vendorList); // Ensure this is not empty or undefined
        console.log(vendors_id); // Ensure it has the expected value and type
        console.log(selectedVendor); // This should give more insight

        console.log("selectedVendor 12 ", selectedVendor);

        if (selectedVendor) {
          setDisplayName(selectedVendor.DisplayName);
          console.log("selectedVendor.DisplayName  ", selectedVendor.DisplayName);
        }

        const vendorIdString = vendors_id.toString();
        setSelectedVendorId(vendorIdString);
        dispatch(listBillAddressVendor({ vendors_id: vendors_id }));


      }


      // Reset the state to avoid repeated calls
      setSubmissionCompleted(false);
    }

    dispatch(listVendor())
  }, [submissionCompleted, vendorDetails, dispatch]);


  const resetEditItem = () => {
    setEditItem(null);
  };
  const toggleForm = () => {
    setEditItem(null)
    setOpen(true);
  };
  useEffect(() => {
    dispatch(listVendor())
    dispatch(listCity())

  }, [props.editVendorDetails]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }


  // Function to handle edit icon click
  const handleEditClick = (item: any) => {
    setEditItem(item); // Set the edit data
    setOpen(true); // Open the form modal
  };


  const deleteAddress = async () => {
    try {
      setLoading(true)
      const action = await dispatch(deleteBillAddress({ bill_address_id: editId }));
      console.log({ action })
      const response = action.payload;
      // props.setEditData(null);
      // console.log(response);
      // if (response.message.message === "Bill-address deleted successfully") {
      //   toast.success(response.message.message);
      //   await dispatch(listBillAddressVendor({ vendors_id: props.editData.Id }))
      //   resetDeleteData(); // Reset delete confirmation state
      // }
    } catch (error) {
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {

      if (props.editVendorDetails) {
        const action = await dispatch(vendorPut({
          vendor_id: props.editVendorDetails.Id,
          ...initialData
        }));
        setInitialData({ ...VendorInitialValues });
        const response = action.payload;
        const vendorID = props.editVendorDetails.Id;
        if (typeof vendorID === 'number') {
          setVendorDetails(vendorID);
        } else {
          console.error("Vendor ID is not a number:", vendorID);
        }
        setSubmissionCompleted(true);
        toast.success(response.message.message);
        // setDisabled(true);
        props.setEditVendorDetails({ ...VendorInitialValues });
        // props.toggleVendorForm();
        // props.toggleForm();

        if (response.message.code === "SUCCESS") {
          await dispatch(listVendor());
        }
      } else {
        const action = await dispatch(vendorAdd(initialData));
        const response = action.payload;
        console.log("Response:", response); // Inspect the response structure
        const vendorID = response.message.data.Id;
        if (typeof vendorID === 'number') {
          setVendorDetails(vendorID);
        } else {
          console.error("Vendor ID is not a number:", vendorID);
        }
        setInitialData({ ...VendorInitialValues });
        setSubmissionCompleted(true);
        toast.success(response.message.message);
        // props.setEditVendorDetails({ ...VendorInitialValues });
        if (response.message.code === "SUCCESS") {
          await dispatch(listVendor());
        }
        setDisabledButton(false)
      }
      setDisabled(true);

      // setInitialData(VendorInitialValues); // Reset the form data
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Box>
      <Box>
        <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={1} mt={2}>
            {/* <Grid item xs={12} sm={4}>
              <TextValidator
                label="First Name"
                onChange={handleChange}
                name="GivenName"
                value={initialData.GivenName}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Middle Name"
                onChange={handleChange}
                name="MiddleName"
                value={initialData.MiddleName}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                disabled={disabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Last Name"
                onChange={handleChange}
                name="FamilyName"
                value={initialData.FamilyName}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                disabled={disabled}
                fullWidth
              />
            </Grid> */}
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Display Name *"
                onChange={handleChange}
                name="DisplayName"
                value={initialData.DisplayName}
                validators={['required']}
                errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextValidator
                label="Primary Phone *"
                onChange={handleChange}
                name="PrimaryPhone"
                value={initialData.PrimaryPhone}
                validators={['required']}
                errorMessages={['This field is required']}
                size="small"
                variant="filled"
                disabled={disabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Domain"
                onChange={handleChange}
                name="Domain"
                value={initialData.Domain}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                disabled={disabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Account Number"
                onChange={handleChange}
                name="AccountNumber"
                value={initialData.AccountNumber}
                disabled={disabled}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Company Name"
                onChange={handleChange}
                name="CompanyName"
                value={initialData.CompanyName}
                // validators={['required']}
                disabled={disabled}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextValidator
                label="Web Address"
                onChange={handleChange}
                disabled={disabled}
                name="WebAddress"
                value={initialData.WebAddress}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Primary Email"
                onChange={handleChange}
                disabled={disabled}
                name="PrimaryEmail"
                value={initialData.PrimaryEmail}
                // validators={['required']}
                // errorMessages={['This field is required']}
                size="small"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextValidator
                label="Balance"
                type="number"
                onChange={handleChange}
                disabled={disabled}
                name="Balance"
                value={initialData.Balance}
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
              name="Save"
              variant='contained'
              loading={addVendorLoading}
              disabled={addVendorLoading}
            />
          </Grid>
        </ValidatorForm>
      </Box>

      <Divider sx={{ my: 2, py: 3 }} />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" disabled={disabledButton} onClick={toggleForm}>
            Add Bill Address
          </Button>
        </Box>;
        <GeneralModal open={open} handleClose={() => { setOpen(false); resetEditItem(); }} title='Add Bill Address' >
          <VendorBillAddressForm
            vendorId={selectedVendorId}

            toggle={() => setOpen(false)}
            editItem={editItem}
          />
        </GeneralModal >
        < TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ background: '#f5f5f5', whiteSpace: 'nowrap' }}>
                <TableCell>SN</TableCell>
                <TableCell> Street 1</TableCell>
                <TableCell> Street 2</TableCell>
                <TableCell> City </TableCell>
                <TableCell> State </TableCell>
                <TableCell> Zip </TableCell>
                {/* <TableCell> Line 2</TableCell>
              <TableCell> Line 3</TableCell>
              <TableCell> Line 4</TableCell>
              <TableCell> Line 5</TableCell> */}
                <TableCell> Country</TableCell>
                <TableCell>Lat</TableCell>
                <TableCell>Long</TableCell>
                {/* <TableCell> City</TableCell> */}
                {/* <TableCell> CountrySubDivisionCode </TableCell> */}
                {/* <TableCell> Postal Code</TableCell> */}
                {/* <TableCell> Lat</TableCell> */}
                {/* <TableCell> Long</TableCell> */}
                {/* <TableCell> Note</TableCell> */}
                <TableCell> Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billAddressVendorListData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                billAddressVendorListData?.map((item: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.Line1}</TableCell>
                    <TableCell>{item.Line2}</TableCell>
                    <TableCell>{findCityName(item.CitiesFId)}</TableCell>
                    <TableCell>{findStateName(item.StatesFId)}</TableCell>
                    <TableCell>{item.Zip}</TableCell>
                    {/* <TableCell>{item.Line3}</TableCell> */}
                    {/* <TableCell>{item.Line4}</TableCell> */}
                    {/* <TableCell>{item.Line5}</TableCell> */}
                    <TableCell>{item.Country}</TableCell>
                    <TableCell>{item.Lat}</TableCell>
                    <TableCell>{item.Long}</TableCell>
                    <TableCell>
                      <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => handleEditClick(item)}>
                        <Tooltip title="View Details" placement="top" arrow>
                          <ModeEditOutlineIcon sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => handleDeleteClick(item.Id)}>
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
        </TableContainer >
        <ConfirmationModal
          open={modal}
          handleModal={() => toggleModal()}
          handleConfirmClick={() => deleteAddress()}
        />
      </Box>
    </Box>
  )
}

export default VendorForm;