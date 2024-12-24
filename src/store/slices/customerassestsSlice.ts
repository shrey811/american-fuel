
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


import { rootConstants } from 'globalConstants/rootConstants';

import { apiHandler } from 'modules/apiHandler';
import { CustomerAssestStateType } from 'types/CustomerAssest';
import { ProductCategoryStateType } from 'types/ProductCategory';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'customerAssest';


export const listCustomerAssest = createAsyncThunk(`${sliceName}/customerAssestList`, async (initialData: any) => {
    const { customerAssest_id } = initialData;
    const response = await getRequest(`${rootConstants.CUSTOMER_ASSETS_URL}/${customerAssest_id}`);
    return response
});

export const addCustomerAssest = createAsyncThunk(`${sliceName}/customerAssestCategory`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.CUSTOMER_ASSETS_URL}`, initialData);
    return response
});

export const updateCustomerAssest = createAsyncThunk(`${sliceName}/customerAssestUpdate`, async (initialData: any) => {
    const { customerAssest_id, ...customerAssest } = initialData;
    const response = await putRequest(`${rootConstants.CUSTOMER_ASSETS_URL}/${customerAssest_id}`, customerAssest);
    return response;
});
export const deleteCustomerAssest = createAsyncThunk(`${sliceName}/customerAssestDelete`, async (initialData: any) => {
    const { customerAssest_id, ...customerAssest } = initialData;
    const response = await deleteRequest(`${rootConstants.CUSTOMER_ASSETS_URL}/${customerAssest_id}`, customerAssest);
    return response;
});

export const addProductCustomerAssest = createAsyncThunk(`${sliceName}/customerAssestproductAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.CUSTOMER_ASSETS_URL}/products`, initialData);
    return response;
});

const initialState: CustomerAssestStateType = {
    listCustomerAssestLoading: false,
    addCustomerAssestLoading: false,
    updateCustomerAssestLoading: false,
    deleteCustomerAssestLoading: false,
    customerAssestList: [],
};

const customerAssestSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listCustomerAssest.pending, (state) => {
            state.listCustomerAssestLoading = true; // Update state property name
        });
        builder.addCase(listCustomerAssest.fulfilled, (state, action) => {
            state.customerAssestList = action.payload?.message.data || []; // Update state property name
            state.listCustomerAssestLoading = false; // Update state property name
        });
        builder.addCase(listCustomerAssest.rejected, (state) => {
            state.listCustomerAssestLoading = false; // Update state property name
            state.customerAssestList = []; // Update state property name
        });


        builder.addCase(addCustomerAssest.pending, (state) => {
            state.addCustomerAssestLoading = true; // Update state property name
        });
        builder.addCase(addCustomerAssest.fulfilled, (state, action) => {
            // state. = action.payload?.message.data; // Update state property name
            state.addCustomerAssestLoading = false; // Update state property name
        });
        builder.addCase(addCustomerAssest.rejected, (state) => {
            state.addCustomerAssestLoading = false; // Update state property name
            // state.productCategoryListData = []; // Update state property name
        });


        builder.addCase(updateCustomerAssest.pending, (state) => {
            state.updateCustomerAssestLoading = true;
        });
        builder.addCase(updateCustomerAssest.fulfilled, (state, action) => {
            // state.productCategoryListData = action.payload?.message.data;
            state.updateCustomerAssestLoading = false;
        });
        builder.addCase(updateCustomerAssest.rejected, (state) => {
            state.updateCustomerAssestLoading = false;
            // state.productCategoryListData = [];
        });


        builder.addCase(deleteCustomerAssest.pending, (state) => {
            state.deleteCustomerAssestLoading = true;
        });
        builder.addCase(deleteCustomerAssest.fulfilled, (state, action) => {
            state.deleteCustomerAssestLoading = false;
        });
        builder.addCase(deleteCustomerAssest.rejected, (state) => {
            state.deleteCustomerAssestLoading = false;

        });
    }
});

const customerAssestReducers = customerAssestSlice.reducer;
export default customerAssestReducers;
