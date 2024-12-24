import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import GeneralModal from 'components/UI/GeneralModal';
import DropShippingForm from './DropShippingForm';
import DropShippingList from './DropShippingList';
import GeneralCard from 'components/UI/GeneralCard';
import Log from 'features/GlobalLogs/Log';

interface Props {
    open: boolean;
    onClose: () => void;
}

const DropShippingPage = (props: Props) => {
    const [editData, setEditData] = useState<any>();
    const [showForm, setShowForm] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);


    const toggleForm = () => {
        if (showForm) {
            setEditData(null)
        }
        setShowForm(!showForm);
    };

    const handleModalClose = () => {
        props.onClose();
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <GeneralCard title="Drop Shipping" arrowLeft={showForm ? toggleForm : undefined} >
                    <Box className="Drop Shipping" sx={{ width: '100%', mt: 2 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
                                <div style={{ display: showForm ? 'block' : 'none' }}>
                                    <DropShippingForm editData={editData} setEditData={setEditData} backToList={toggleForm} selectedIds={selectedIds} />
                                </div>
                                <div style={{ display: showForm ? 'none' : 'block' }}>
                                    <DropShippingList setEditData={setEditData} toggleForm={toggleForm} />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </GeneralCard>
            </Grid>

        </Grid>
    );
};

export default DropShippingPage;
