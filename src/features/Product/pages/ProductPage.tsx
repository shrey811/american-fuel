import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import Button from 'components/Button/Button';
import { toast } from 'react-toastify';

import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { shallowEqual } from 'react-redux';
import { updateIntuitProduct } from 'store/slices/productSlice';
import { listPurchaseOrder } from 'store/slices/purchaseorder';
import GeneralModal from 'components/UI/GeneralModal';
interface Props {
    open: boolean;
    onClose: () => void;
}

const Product = (props: Props) => {
    const dispatch = useAppDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<any>();
    // const [fetchProduct, setFetchProduct] = useState<any>();
    console.log({ editData });

    const [editProductCategory, setEditProductCategory] = useState<any>();
    console.log({ editProductCategory });

    const [productList, listProductIntuitLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductIntuitLoading
        ],
        shallowEqual
    );

    const handleUpdateIntuitData = async () => {
        try {
            const action = await dispatch(updateIntuitProduct());
            const response = action.payload
            listProductIntuitLoading;

            if ("Add customer is successful") {
                dispatch(listPurchaseOrder())

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
        }
    };

    const handleModalClose = () => {
        props.onClose();
    };

    return (
        <GeneralModal open={props.open} handleClose={handleModalClose} title="Product" LeftArrow={showForm ? toggleForm : null}>
            <Box sx={{ width: '650px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
                        {!showForm && (
                            <Box sx={{ display: 'flex' }}>
                                <div>
                                    <Button variant="contained" color="primary"
                                        onClick={handleUpdateIntuitData}
                                        loading={listProductIntuitLoading}
                                        disabled={listProductIntuitLoading}
                                        sx={{ mr: 2 }}
                                    >
                                        Update Intuit Data
                                    </Button>
                                </div>
                                <div style={{ marginLeft: '1rem' }}>
                                    <Button variant="contained" color="primary" onClick={toggleForm}>
                                        Create Product
                                    </Button>
                                </div>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
                        <div style={{ display: showForm ? 'block' : 'none' }}>
                            <ProductForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
                        </div>
                        <div style={{ display: showForm ? 'none' : 'block' }}>
                            <ProductList setEditData={setEditData} toggleForm={toggleForm} />
                        </div>
                    </Grid>
                </Grid>
            </Box >
        </GeneralModal>
    )
}

export default Product;
