import React, { useEffect, useState } from 'react';
import {
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Box,
  Button
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import VendorBillAddressForm from './VendorBillAddressForm';
import GeneralModal from 'components/UI/GeneralModal';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { deleteBillAddress } from 'store/slices/billaddressSlice';
import { shallowEqual } from 'react-redux';
import { listBillAddressVendor } from 'store/slices/billAddressVendorSlice';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';

interface Props {
  editData?: any;
  setEditData?: any;
}

const VendorBillAddress = (props: Props) => {

  const [vendorBillAdd, setVendorBillAdd] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [editItem, setEditItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  console.log({ editItem });

  const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (props.editData) {
      setVendorBillAdd([props.editData]);
      setSelectedVendorId(props.editData.Id);
      setDisplayName(props.editData.DisplayName);
    }
  }, [props.editData]);

  const toggleForm = () => {
    setEditItem(null)
    setOpen(true);
  };

  // Function to handle edit icon click
  const handleEditClick = (item: any) => {
    setEditItem(item); // Set the edit data
    setOpen(true); // Open the form modal
  };

  const [billAddressVendorListData, billAddressVendorDataLoading] = useAppSelector(
    (state) => [
      state.billAddressVendorReducers.billAddressVendorListData || [],
      state.billAddressVendorReducers.billAddressVendorDataLoading
    ],
    shallowEqual
  );

  // useEffect(() => {
  //   dispatch(listBillAddressVendor())
  // }, [])

  const deleteAddress = async () => {
    try {
      setLoading(true)
      const action = await dispatch(deleteBillAddress({ bill_address_id: editId }));
      console.log({ action })
      const response = action.payload;
      // props.setEditData(null);
      // console.log(response);
      if (response.message.message === "Bill-address deleted successfully") {
        toast.success(response.message.message);
        await dispatch(listBillAddressVendor({ vendors_id: props.editData.Id }))
        resetDeleteData(); // Reset delete confirmation state
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  const resetEditItem = () => {
    setEditItem(null);
  };

  if (billAddressVendorDataLoading || loading) {
    return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}><FallbackLoader /></div>;
  }

  return (
    <>
      {/* <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={toggleForm}>Add Bill Address</Button>
      </Box>

      <GeneralModal open={open} handleClose={() => { setOpen(false); resetEditItem(); }} title='Add Bill Address' >
        <VendorBillAddressForm
          vendorId={selectedVendorId}
          // vendorName={displayName}
          toggle={() => setOpen(false)}
          editItem={editItem}
        />
      </GeneralModal >

      <ConfirmationModal
        open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() => deleteAddress()}
      /> */}
    </>
  )
}

export default VendorBillAddress;