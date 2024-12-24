import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'

import TaxForm from './TaxForm'
import TaxList from './TaxList'
import { useAppDispatch } from 'hooks/useStore'
import { listTax } from 'store/slices/taxSlice'
import TaxRateForm from './TaxRateForm'

import Button from 'components/Button/Button'
import { listTaxRate } from 'store/slices/taxRateSlice'
import GeneralModal from 'components/UI/GeneralModal'
import TaxRateList from './TaxRateList'
interface Props {
    open: boolean;
    onClose: () => void;
}
const TaxRatePage = (props: Props) => {

    const dispatch = useAppDispatch();
    const [editData, setEditData] = useState<any>();
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
        if (showForm) {
            setEditData(null)
        }
    };

    const handleModalClose = () => {
        props.onClose();
    };

    useEffect(() => {
        dispatch(listTaxRate());
    }, []);
    return (
        <GeneralModal open={props.open} handleClose={handleModalClose} title="Tax Rate" LeftArrow={showForm ? toggleForm : null}>
            <Box sx={{ width: '650px' }}>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
                        {!showForm && (
                            <Button variant="contained" color="primary" onClick={toggleForm}>
                                Create Tax
                            </Button>
                        )}

                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
                        <div style={{ display: showForm ? 'block' : 'none' }}>
                            <TaxRateForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
                        </div>
                        <div style={{ display: showForm ? 'none' : 'block' }}>
                            <TaxRateList setEditData={setEditData} toggleForm={toggleForm} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </GeneralModal>
    )
}
export default TaxRatePage;
