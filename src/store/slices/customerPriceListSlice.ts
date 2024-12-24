import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CustomerPriceListStateType } from 'types/CustomerPriceListType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;
const sliceName = 'customers'

export const customerPriceList = createAsyncThunk(`${sliceName}/CutomerPriceList`, async (initialData: any) => {

    const response = await postRequest(`${rootConstants.CUSTOMERPRICELIST_URL}`, initialData);
    return response;
});
// export const listcustomerPriceList = createAsyncThunk(`${sliceName}/listCutomerPriceList`, async (initialData: any) => {

//     const response = await getRequest(`${rootConstants.CUSTOMERPRICELIST_URL}`);
//     return response;
// });
// // send email too user
export const customerEmail = createAsyncThunk(`${sliceName}/listCutomerList`, async (initialState: any) => {

    const { CustomerId } = initialState;
    const response = await postRequest(`${rootConstants.CUSTOMEREMAIL_URL}/${CustomerId}`, initialState);
    return response;
});

const initialState: CustomerPriceListStateType = {

    listCustomerPriceListLoading: false,
    addCustomerEmailLoading: false,
    // customerPriceListListLoading: false,
    customerPriceListList: [],
};

const customerPriceListSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //filter customer price list
        builder.addCase(customerPriceList.pending, (state) => {
            state.listCustomerPriceListLoading = true;
        });
        builder.addCase(customerPriceList.fulfilled, (state, action) => {
            state.customerPriceListList = action.payload?.message.data || []; // Update state property name
            state.listCustomerPriceListLoading = false;
        });
        builder.addCase(customerPriceList.rejected, (state) => {
            state.listCustomerPriceListLoading = false;
            state.customerPriceListList = [];
        });

        //get all customer price list
        // builder.addCase(listcustomerPriceList.pending, (state) => {
        //     state.customerPriceListListLoading = true;
        // });
        // builder.addCase(listcustomerPriceList.fulfilled, (state, action) => {
        //     state.customerPriceListList = action.payload?.message.data || []; // Update state property name
        //     state.customerPriceListListLoading = false;
        // });
        // builder.addCase(listcustomerPriceList.rejected, (state) => {
        //     state.customerPriceListListLoading = false;
        //     state.customerPriceListList = [];
        // });

        // builder.addCase(customerEmail.pending, (state) => {
        //     state.addCustomerEmailLoading = true;
        // });
        // builder.addCase(customerEmail.fulfilled, (state, action) => {
        //     // state.customerListData = action.payload?.data; // Update state property name
        //     state.addCustomerEmailLoading = false;
        // });
        // builder.addCase(customerEmail.rejected, (state) => {
        //     state.addCustomerEmailLoading = false;
        //     // state.customerListData = [];
        // });
    }
});

const customerPriceListReducers = customerPriceListSlice.reducer;
export default customerPriceListReducers;

