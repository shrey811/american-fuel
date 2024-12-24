import React, { useEffect, useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { addProductCategory, listProductCategory, updateProductCategory } from 'store/slices/productCategorySlice';
import Button from 'components/Button/Button';

interface Props {
  editProductCategory?: any;
  setEditProductCategory?: any;
  backToList?: any;
}

const productInitialValue = {
  Name: '',
}

const ProductCategoryForm = (props: Props) => {

  const dispatch = useAppDispatch();

  const [initialData, setInitialData] = useState<typeof productInitialValue>({
    ...productInitialValue
  });
  const [productCategoryList, addProductCategoryLoading] = useAppSelector(
    (state) => [
      state.productCategoryReducers.productCategoryList,
      state.productCategoryReducers.addProductCategoryLoading
    ],
    shallowEqual
  );

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }

  useEffect(() => {
    if (props.editProductCategory) {
      setInitialData(props.editProductCategory);
    } else {
      setInitialData(productInitialValue);
    }
  }, [props.editProductCategory]);
  const handleSubmit = async () => {

    if (props.editProductCategory) {
      const action = await dispatch(updateProductCategory({
        productCategory_id: props.editProductCategory.Id,
        ...initialData
      }));
      setInitialData({ ...productInitialValue });
      const response = action.payload;
      props.setEditProductCategory(null);
      props.backToList();
      if (response.message.code === "SUCCESS") {
        toast.success(response.message.message);
      }
      if (response.message.code === "FAILED") {
        toast.error(response.message.message);
      }
      if (response.message.code === "SUCCESS") {
        dispatch(listProductCategory())
      }
    } else {
      const action = await dispatch(addProductCategory(initialData));
      setInitialData({ ...productInitialValue });
      const response = action.payload;

      props.backToList();
      if (response.message.code === "SUCCESS") {
        toast.success(response.message.message);
      }
      if (response.message.code === "FAILED") {
        toast.error(response.message.message);
      }
      if (response.message.code === "SUCCESS") {
        dispatch(listProductCategory())
      }
    }
  }

  return (
    <>
      <Box >
        <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2} pl={4}>
            <Grid xs={12} sm={12} mt={3} >
              <TextValidator
                label="Product Category"
                onChange={handleChange}
                name="Name"
                value={initialData.Name}
                validators={['required']}
                errorMessages={['This field is required']}
                // sx={{ width: '100%', mt: 3, pr: 2 }}
                size="small"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid sx={{ textAlign: 'end' }} sm={12} mt={1}>
              <Button
                type="submit"
                name="Save"
                variant='contained'
                loading={addProductCategoryLoading}
                disabled={addProductCategoryLoading}
              />
            </Grid>
          </Grid>
        </ValidatorForm>
      </Box>
    </>
  )
}

export default ProductCategoryForm;