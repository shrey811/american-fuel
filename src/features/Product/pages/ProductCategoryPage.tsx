import { Box, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listProductCategory } from 'store/slices/productCategorySlice';
import { updateIntuitProduct } from 'store/slices/productSlice';
import ProductCategoryForm from './ProductCategoryForm';
import ProductCategoryList from './ProductCategoryList';
import Button from 'components/Button/Button';
import GeneralModal from 'components/UI/GeneralModal';
interface Props {
    open: boolean;
    onClose: () => void;
}

const ProductCategoryPage = (props: Props) => {

    const dispatch = useAppDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<any>();

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

                dispatch(listProductCategory())
            }
            toast.success(response.message.message);
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while updating Intuit data.");
        }
    };

    const toggleForm = () => {
        if (showForm) {
            setEditProductCategory(null)
        }
        setShowForm(!showForm);
    };

    const handleModalClose = () => {
        props.onClose();
    };

    return (
        <GeneralModal open={props.open} handleClose={handleModalClose} title="Product Category" LeftArrow={showForm ? toggleForm : null}>
            <Box sx={{ width: '650px' }}>
                <Grid container spacing={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
                            {!showForm && (
                                <Box sx={{ display: 'flex' }}>
                                    <div>
                                        <Button variant="contained" color="primary"
                                            onClick={handleUpdateIntuitData}
                                            loading={listProductIntuitLoading}
                                            disabled={listProductIntuitLoading}

                                        >
                                            Update Intuit Data
                                        </Button>
                                    </div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <Button variant="contained" color="primary" onClick={toggleForm} >
                                            Create Product category
                                        </Button>
                                    </div>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{}}>
                            <div style={{ display: showForm ? 'block' : 'none' }}>
                                <ProductCategoryForm editProductCategory={editProductCategory} setEditProductCategory={setEditProductCategory} backToList={toggleForm} />
                            </div>
                            <div style={{ display: showForm ? 'none' : 'block' }}>
                                <ProductCategoryList setEditProductCategory={setEditProductCategory} toggleForm={toggleForm} />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </GeneralModal>
    )
}

export default ProductCategoryPage;