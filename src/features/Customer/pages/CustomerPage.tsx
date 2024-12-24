import { Box, Grid, Modal, Tab, Tabs } from '@mui/material';
import GeneralCard from 'components/UI/GeneralCard';
import React, { useEffect, useState } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listCustomer, updateIntuitCustomer } from 'store/slices/customerSlice';
import Log from 'features/GlobalLogs/Log';
import CustomerViewDetails from './CustomerViewDetails';
import CustomerBillAddressList from './CustomerBillAddressList';
import CustomerShipAddressList from './CustomerShipAddressList';
import CustomerPriceList from './CustomerPriceList';

interface Props {
  editData?: any;
  setEditData?: any;
  toggleForm: () => void;
}

const CustomerPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPriceRuleForm, setShowPriceRuleForm] = useState(false);
  const [showFreightRuleForm, setShowFreightRuleForm] = useState(false);
  const [customerPR, setCustomerPR] = useState<any>();
  console.log({ customerPR })
  const [customerFR, setCustomerFR] = useState<any>();
  console.log({ CUSTOMERFREIGHTRULL: customerFR })
  const [customerAssets, setCustomerAssets] = useState();
  const [editData, setEditData] = useState<any>();
  const [fetchCustomer, setFetchCustomer] = useState<any>();

  const [customerList, updateIntuitCustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.updateIntuitCustomerLoading,
    ],
    shallowEqual
  );

  const [customerPRListData, customerPRLoading] = useAppSelector(
    (state) => [
      state.customerPRReducers.customerPRListData,
      state.customerPRReducers.customerPRLoading,
    ],
    shallowEqual
  );

  const [customerFreightRuleListData, customerFreightRuleLoading] = useAppSelector(
    (state) => [
      state.customerFreightRuleReducers.customerFreightRuleListData,
      state.customerFreightRuleReducers.customerFreightRuleLoading,
    ],
    shallowEqual
  );

  // UseEffect to update customerPR when customerPRListData changes
  useEffect(() => {
    if (customerPRListData) {
      setCustomerPR(customerPRListData);
    }
    if (customerFreightRuleListData) {
      setCustomerFR(customerFreightRuleListData)
    }
  }, [customerPRListData]);

  // UseEffect to update customerFR when customerFRListData changes
  useEffect(() => {
    if (customerFreightRuleListData) {
      setCustomerFR(customerFreightRuleListData)
    }
  }, [customerFreightRuleListData]);

  const toggleForm = () => {
    if (showForm) {
      setEditData(null)
    }
    setShowForm(!showForm);
  };

  const toggleDetails = () => {
    setShowDetails((prev) => {
      if (!prev) {
        setShowPriceRuleForm(false);  // Reset to show table first
        // setShowFreightRuleForm(false);
      }
      return !prev;
    });
  };

  // const togglePriceRuleForm = () => {
  //   setShowPriceRuleForm((prev) => !prev);
  // };

  // const toggleFreightRuleForm = () => {
  //   setShowFreightRuleForm((prev) => !prev);
  // };

  const togglePriceRuleForm = () => {
    setShowPriceRuleForm((prev) => {
      if (!prev) {
        setShowFreightRuleForm(false);  // Close freight rule form when opening price rule form
      }
      return !prev;
    });
  };

  const toggleFreightRuleForm = () => {
    setShowFreightRuleForm((prev) => {
      if (!prev) {
        setShowPriceRuleForm(false);  // Close price rule form when opening freight rule form
      }
      return !prev;
    });
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateIntuitData = async () => {
    try {
      const action = await dispatch(updateIntuitCustomer());
      const response = action.payload;

      if (response.message) {
        dispatch(listCustomer());
        toast.success(response.message.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating Intuit data.");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <GeneralCard
          title="Customer"
          add={!showForm ? toggleForm : undefined}
          arrowLeft={showForm ? toggleForm : showDetails ? toggleDetails : undefined}
          addLabel="Create Customer/Address"
        >
          <Box>
            <Grid item xs={12} sm={12}>
              {showForm ? (
                <>
                  <Grid item xs={12} sm={12}>
                    <CustomerForm editData={editData} setEditData={setEditData} toggleForm={toggleForm} />
                  </Grid>
                </>
              ) : showDetails ? (
                <>

                  <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '30rem', top: '0', mt: '0' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpen} // Open the modal
                    >
                      Customer Show Price List
                    </Button>

                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="customer-price-list-modal"
                      aria-describedby="view-customer-price-list"
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          bgcolor: "background.paper",
                          boxShadow: 24,
                          p: 4,
                          borderRadius: 2,
                        }}
                      >
                        {/* Suspense to handle lazy loading */}

                        <CustomerPriceList fetchCustomer={fetchCustomer} />

                      </Box>
                    </Modal>

                  </Box>
                  <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '10rem', top: '0', mt: '0' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={togglePriceRuleForm}  // Only toggle the form, don't reset state
                    >
                      {showPriceRuleForm ? "Back to Customer Price Rule" : "Create Customer Price Rule"}
                    </Button>

                  </Box>

                  <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '20rem', top: '0', mt: '0' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={toggleFreightRuleForm}
                    >
                      {showFreightRuleForm ? "Back to Customer Feight Rule" : "Create Customer Freight Rule"}
                    </Button>
                  </Box>

                  <CustomerViewDetails
                    fetchCustomer={fetchCustomer}
                    toggleDetails={toggleDetails}
                    setFetchCustomer={setFetchCustomer}
                    toggleForm={toggleForm}
                    setEditData={setEditData}
                    customerPR={customerPR}
                    showPriceRuleForm={showPriceRuleForm}
                    togglePriceRuleForm={togglePriceRuleForm}
                    toggleFreightRuleForm={toggleFreightRuleForm}
                    setCustomerPR={setCustomerPR}
                    customerAssets={customerAssets}
                    showFreightRuleForm={showFreightRuleForm}
                    setCustomerFR={setCustomerFR}
                    customerFR={customerFR}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '9.7rem', top: '0', mt: '0' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateIntuitData}
                      loading={updateIntuitCustomerLoading}
                      disabled={updateIntuitCustomerLoading}
                    >
                      Update Intuit Data
                    </Button>
                  </Box>
                  <Grid item xs={12} sm={12} mt={2}>
                    <CustomerList
                      setEditData={setEditData}
                      setFetchCustomer={setFetchCustomer}
                      toggleForm={toggleForm}
                      toggleDetails={toggleDetails}
                      setCustomerPR={setCustomerPR}
                      setCustomerFR={setCustomerFR}
                      setCustomerAssets={setCustomerAssets}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </GeneralCard>
      </Grid>

    </Grid>
  );
}

export default CustomerPage;