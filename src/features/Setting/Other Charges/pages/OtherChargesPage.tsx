import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import Button from 'components/Button/Button';
import { toast } from 'react-toastify';


import { shallowEqual } from 'react-redux';
import { updateIntuitProduct } from 'store/slices/productSlice';
import { listPurchaseOrder } from 'store/slices/purchaseorder';
import GeneralModal from 'components/UI/GeneralModal';
import OtherChargesFrom from './OtherChargesFrom';
import OtherChargesList from './OtherChargesList';
interface Props {
    open: boolean;
    onClose: () => void;
}

const OtherChargesPage = (props: Props) => {
    const dispatch = useAppDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<any>();


    const toggleForm = () => {
        setShowForm(!showForm);
        if (showForm) {
            setEditData(null);
        }
    };

    const handleModalClose = () => {
        props.onClose();
    };

    return (
        <GeneralModal open={props.open} handleClose={handleModalClose} title="Other Charges" LeftArrow={showForm ? toggleForm : null}>
            <Box sx={{ width: '650px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
                        {!showForm && (
                            <Box sx={{ display: 'flex' }}>
                                <div style={{ marginLeft: '1rem' }}>
                                    <Button variant="contained" color="primary" onClick={toggleForm}>
                                        Create Other Charges
                                    </Button>
                                </div>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
                        <div style={{ display: showForm ? 'block' : 'none' }}>
                            <OtherChargesFrom editData={editData} setEditData={setEditData} backToList={toggleForm} />
                        </div>
                        <div style={{ display: showForm ? 'none' : 'block' }}>
                            <OtherChargesList setEditData={setEditData} toggleForm={toggleForm} />
                        </div>
                    </Grid>
                </Grid>
            </Box >
        </GeneralModal>
    )
}

export default OtherChargesPage;
