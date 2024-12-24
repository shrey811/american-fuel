import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@mui/material';
import GeneralModal from 'components/UI/GeneralModal';
import CustomerBillAddressForm from './CustomerBillAddressForm';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import { deleteBillAddress, getBillAddressCustomer } from 'store/slices/billaddressSlice';
import { toast } from 'react-toastify';
import { listCity } from 'store/slices/citySlice';
type Props =
  {
    editItem?: any;
    customerId: string;
    editData?: any;
  }

const CustomerBillAddressList = (props: Props) => {
  const dispatch = useAppDispatch();
  const [addressPage, setAddressPage] = useState(0);
  const [addressRowsPerPage, setAddressRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();
  const [editItem, setEditItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [billAddressList, listBillAddressCustomersLoading] = useAppSelector(
    (state) => [
      state.billAddressReducers.billAddressList || [],
      state.billAddressReducers.listBillAddressCustomersLoading
    ],
    shallowEqual
  );

  useEffect(() => {

    setLoading(true);

    if (props.editData) {
      const customerIdString = Number(props.customerId);
      dispatch(getBillAddressCustomer({ customer_bill_address_id: props.editData.Id }))
        .finally(() => setLoading(false));
    } else {
      dispatch(getBillAddressCustomer({ customer_bill_address_id: undefined }))
        .finally(() => setLoading(false));
    }
  }, [props.editData, props.customerId, dispatch]);


  const handleEditClick = (item: any) => {
    setEditItem(item); // Set the edit data
    setOpen(true); // Open the form modal
  };

  const toggleForm = () => {
    setEditItem(null)
    setOpen(true);
  };

  const resetEditItem = () => {
    setEditItem(null);
  };

  const handleChangeAddressPage = (event: unknown, newPage: number) => {
    setAddressPage(newPage);
  };

  const handleChangeAddressRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressRowsPerPage(parseInt(event.target.value, 10));
    setAddressPage(0);
  };

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
  const deleteAddress = async () => {
    try {
      const action = await dispatch(deleteBillAddress({ bill_address_id: editId }));
      const response = action.payload;

      // Reset delete confirmation state
      if (response.message.message === 'Bill-address deleted successfully') {
        const customerIdString = Number(props.customerId)
        dispatch(getBillAddressCustomer({ customer_bill_address_id: customerIdString }));
      }
      toast.success(response.message.message);
      resetDeleteData();
    } catch (error) {
      console.error('Error in deleteAddress:', error);
      toast.error("Something went wrong");
    }
  };


  return (
    <>
      <GeneralModal open={open} handleClose={() => { setOpen(false); resetEditItem(); }} title='Add Bill Address'>

        <CustomerBillAddressForm
          customerId={props.customerId}
          editItem={editItem}
          toggleForm={() => setOpen(false)}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : billAddressList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              billAddressList?.map((item: any, index: any) => (
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
                  {/* <TableCell>{item.CountrySubDivisionCode}</TableCell>
                  <TableCell>{item.PostalCode}</TableCell>
                  <TableCell>{item.Note}</TableCell> */}
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
    </>
  )
}

export default CustomerBillAddressList;