import React, { useState } from 'react';
import GeneralCard from 'components/UI/GeneralCard';
import { Box, Divider, Grid, Tab, Tabs } from '@mui/material';
import VendorForm from './VendorForm';
import VendorList from './VendorList';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { listVendor, vendorListUpdate } from 'store/slices/vendorSlice';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import VendorBillAddress from './VendorBillAddressList';
import VendorTerminalList from '../../Terminal/pages/TerminalList';
import Log from 'features/GlobalLogs/Log';

const VendorPage = () => {
  const [editData, setEditData] = useState<any>();
  const [editVendorDetails, setEditVendorDetails] = useState<any>();
  console.log({ editVendorDetails });

  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);


  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    // setValue(newValue);
    setTabIndex(newValue)
  };

  const [vendorList, listVendorIntuitLoading] = useAppSelector(
    (state) => [
      state.vendorReducers.vendorList,
      state.vendorReducers.listVendorIntuitLoading
    ],
    shallowEqual
  );

  const handleUpdateIntuitData = async () => {
    try {
      const action = await dispatch(vendorListUpdate());
      const response = action.payload;
      if ("Add state is successful") {
        dispatch(listVendor());
      }
      toast.success(response.message.message);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating Intuit data.");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditData(null); // Reset editData to null when toggling off the form
      setView(false); // Reset view to false when toggling off the form
    }
  };

  const toggleView = () => {
    setView(!view);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <GeneralCard
          title={"Supplier"}
          add={!showForm ? toggleForm : undefined}
          // back={showForm ? toggleForm : undefined}
          arrowLeft={showForm ? toggleForm : undefined}
          addLabel={"Create Supplier"}
        // backLabel="Back"
        >
          <Box>
            {showForm ? (
              <Grid item xs={12} sm={12}>
                <Divider sx={{ my: 2 }} />
                <VendorForm
                  editVendorDetails={editData}
                  setEditVendorDetails={setEditData}
                  toggleForm={toggleForm}
                />
                {view && (
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ p: 0 }}>
                      {/* <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Bill Address" sx={{ textAlign: 'left' }} />

                      </Tabs> */}

                      <Grid item xs={12} sm={12}>
                        <Box sx={{ display: tabIndex === 0 ? 'block' : 'none', mt: 2 }}>
                          <VendorBillAddress editData={editData} setEditData={setEditData} />
                        </Box>
                        <Box sx={{ display: tabIndex === 1 ? 'block' : 'none', mt: 2 }}>
                          <VendorTerminalList toggleForm={toggleForm} setEditData={setEditData} />
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
            ) : (
              <>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', py: 1, position: 'absolute', right: '7rem', top: '0', mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateIntuitData}
                    loading={listVendorIntuitLoading}
                    disabled={listVendorIntuitLoading}
                  >
                    Update Intuit Data
                  </Button>
                </Box>
                <Grid item xs={12} sm={12} mt={2}>
                  <VendorList
                    setEditData={setEditData}
                    toggleForm={toggleForm}
                    toggleView={toggleView}
                  />
                </Grid>
              </>
            )}
          </Box>
        </GeneralCard>
      </Grid>

    </Grid>
  );
};

export default VendorPage;