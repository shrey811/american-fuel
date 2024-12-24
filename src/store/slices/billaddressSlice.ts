import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { BillAddressStateType } from 'types/BillAddress';
import { CustomerStateType } from 'types/CustomerType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;
const sliceName = 'bill_address';


export const listBillAddress = createAsyncThunk(`${sliceName}/bill_address`, async (billAddress: any) => {
    const response = await postRequest(`${rootConstants.BILL_ADDRESS_URL}`, billAddress);
    return response;
});


export const getBillAddressCustomer = createAsyncThunk(`${sliceName}/bill_address_customer`, async (billAddress: any) => {
    const { customer_bill_address_id, ...billAddressData } = billAddress;
    const response = await getRequest(`${rootConstants.BILL_ADDRESS_URL}/${customer_bill_address_id}`, billAddressData);
    return response;
});


export const updateBillAddress = createAsyncThunk(`${sliceName}/bill_addressPut`, async (initialData: any) => {
    const { bill_address_id, ...billAddressData } = initialData;
    const response = await putRequest(`${rootConstants.BILL_ADDRESS_URL}/${bill_address_id}`, billAddressData);
    return response;
});

export const deleteBillAddress = createAsyncThunk(`${sliceName}/bill_addressDelete`, async (initialData: any) => {
    const { bill_address_id, ...billAddressData } = initialData;
    const response = await deleteRequest(`${rootConstants.BILL_ADDRESS_URL}/${bill_address_id}`, billAddressData);
    return response;
});


const initialState: BillAddressStateType = {
    updateBillAddressLoading: false,
    deleteBillAddressLoading: false,
    listBillAddressLoading: false,
    listBillAddressCustomersLoading: false,
    billAddressList: [],
};

const billAddressSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listBillAddress.pending, (state) => {
            state.listBillAddressLoading = true;
        });
        builder.addCase(listBillAddress.fulfilled, (state, action) => {
            // Update state property name
            state.listBillAddressLoading = false;
        });
        builder.addCase(listBillAddress.rejected, (state) => {
            state.listBillAddressLoading = false;

        });

        builder.addCase(getBillAddressCustomer.pending, (state) => {
            state.listBillAddressCustomersLoading = true;
        });
        builder.addCase(getBillAddressCustomer.fulfilled, (state, action) => {
            state.billAddressList = action.payload?.message.data || [];
            state.listBillAddressCustomersLoading = false;
        });
        builder.addCase(getBillAddressCustomer.rejected, (state) => {
            state.listBillAddressCustomersLoading = false;
            state.billAddressList = [];
        });
        builder.addCase(updateBillAddress.pending, (state) => {
            state.updateBillAddressLoading = true;
        });
        builder.addCase(updateBillAddress.fulfilled, (state, action) => {
            // state.billAddressListData = action.payload?.data; // Update state property name
            state.updateBillAddressLoading = false;
        });
        builder.addCase(updateBillAddress.rejected, (state) => {
            state.updateBillAddressLoading = false;
            // state.billAddressListData = [];
        });
        // builder.addCase(deleteBillAddress.pending, (state) => {
        //     state.deleteBillAddressLoading = true;
        // });
        // builder.addCase(deleteBillAddress.fulfilled, (state, action) => {
        //     // state.billAddressListData = action.payload?.data; // Update state property name
        //     state.deleteBillAddressLoading = false;
        // });
        // builder.addCase(deleteBillAddress.rejected, (state) => {
        //     state.deleteBillAddressLoading = false;
        //     // state.billAddressListData = [];
        // });
    }
});

const billAddressReducers = billAddressSlice.reducer;
export default billAddressReducers;
