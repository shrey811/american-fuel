import { Box, Grid } from '@mui/material'

import React, { useState } from 'react'
import PurchaseOrderForm from './PurchaseOrderForm'
import PurchaseOrderList from './PurchaseOrderList'
import GeneralCard from 'components/UI/GeneralCard'
import Button from 'components/Button/Button'
import { useAppDispatch, useAppSelector } from 'hooks/useStore'
import { shallowEqual } from 'react-redux'
import { listPurchaseOrder, postIntuitPurchaseOrder, updateIntuitPurchaseOrder } from 'store/slices/purchaseorder'
import { toast } from 'react-toastify'
import Log from 'features/GlobalLogs/Log'

interface Props {
  editData?: any
  setEditData?: any;
  toggleForm: () => void;
}

const PurchaseOdrderPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = React.useState<any>();

  // const toggleForm = () => {
  //   setShowForm((showForm) => !showForm);
  // };

  const toggleForm = () => {
    if (showForm) {
      setEditData(null)
    }
    setShowForm(!showForm);
  };

  const [purchaseOrderList, updateIntuitPurchaseOrderLoading] = useAppSelector(
    (state) => [
      state.purchaseOrderReducers.purchaseOrderList,
      state.purchaseOrderReducers.updateIntuitPurchaseOrderLoading,
    ],
    shallowEqual
  );

  const [purchaseOrderList2, postIntuitPurchaseOrderLoading] = useAppSelector(
    (state) => [
      state.purchaseOrderReducers.purchaseOrderList,
      state.purchaseOrderReducers.postIntuitPurchaseOrderLoading,
    ],
    shallowEqual
  );

  const handleUpdateIntuitData = async () => {
    try {
      const action = await dispatch(updateIntuitPurchaseOrder());
      const response = action.payload
      updateIntuitPurchaseOrderLoading;

      if ("Add customer is successful") {
        dispatch(listPurchaseOrder())
      }
      toast.success(response.message.message);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating Intuit data.");
    }
  };

  const handlePostIntuitData = async () => {
    try {

      const action = await dispatch(postIntuitPurchaseOrder());
      const response = action.payload
      updateIntuitPurchaseOrderLoading;

      if (response.message.code === 'SUCCESS') {
        dispatch(listPurchaseOrder());
        toast.success(response.message.message);
      }
      if (response.code === 'ERROR') {
        console.log('response.code', response.code);
        toast.error(response.message.detail);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = "An error occurred while posting Intuit data.";
      console.log({ errorMessage })
      toast.error(errorMessage);
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <GeneralCard title={"Purchase Order"}
          add={!showForm ? toggleForm : undefined}
          // back={showForm ? toggleForm : undefined}
          arrowLeft={showForm ? toggleForm : undefined}
          addLabel='Create Purchase Order'
        >
          <Box>
            <Grid item xs={12} sm={12}>
              {
                showForm ? (
                  <Grid item xs={12} sm={12}>
                    <PurchaseOrderForm editData={editData} setEditData={setEditData} productList={[]} toggleForm={toggleForm} />

                  </Grid>
                ) : (
                  <>
                    <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '9rem', top: '0' }}>
                      <Button variant="contained" color="primary"
                        onClick={handleUpdateIntuitData}
                        loading={updateIntuitPurchaseOrderLoading}
                        disabled={updateIntuitPurchaseOrderLoading}>
                        Update Intuit Data
                      </Button>
                    </Box>
                    <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '16.6rem', top: '0' }}>
                      <Button variant="contained" color="primary"
                        onClick={handlePostIntuitData}
                        loading={postIntuitPurchaseOrderLoading}
                        disabled={postIntuitPurchaseOrderLoading}>
                        Post Intuit Data
                      </Button>
                    </Box>

                    <Grid item xs={12} sm={12} mt={2}>
                      <PurchaseOrderList
                        setEditData={setEditData}
                        toggleForm={toggleForm} />

                    </Grid>

                  </>
                )
              }
            </Grid>
          </Box>
        </GeneralCard>
      </Grid>

    </Grid>
  )
}

export default PurchaseOdrderPage