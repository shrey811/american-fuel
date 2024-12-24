import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { BillAddressStateType } from 'types/BillAddress';
import { BillAddressVendorStateType } from 'types/BillAddressVendor';
import { CustomerStateType } from 'types/CustomerType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'bill_address_vendor';

export const listBillAddressVendor = createAsyncThunk(`${sliceName}/listBillAddress`, async (initialData: any) => {
    const { vendors_id } = initialData;
    const response = await getRequest(`${rootConstants.BILL_ADDRESS_VENDOR_URL}/${vendors_id}`);
    return response
});

export const billAddressVendor = createAsyncThunk(`${sliceName}/bill_address_vendor`, async (billAddress: any) => {
    const response = await postRequest(`${rootConstants.BILL_ADDRESS_VENDOR_URL}`, billAddress);
    return response;
});


export const updateBillAddressVendor = createAsyncThunk(`${sliceName}/bill_address_vendorPut`, async (initialData: any) => {
    const { bill_address_id, ...billAddressData } = initialData;
    const response = await putRequest(`${rootConstants.BILL_ADDRESS_VENDOR_URL}/${bill_address_id}`, billAddressData);
    return response;
});

export const deleteBillAddress = createAsyncThunk(`${sliceName}/deleteBillAddress`, async (initialData: any) => {
    const { bill_address_id, ...billAddressData } = initialData;
    const response = await deleteRequest(`${rootConstants.BILL_ADDRESS_VENDOR_URL}/${bill_address_id}`, billAddressData);
    return response;
});

const initialState: BillAddressVendorStateType = {
    listbilladdressDataloading: false,
    billAddressVendorDataLoading: false,
    deleteBillAddressLoading: false,
    billAddressVendorListData: [],
};

const billAddressVendorSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listBillAddressVendor.pending, (state) => {
            state.listbilladdressDataloading = true;
        });
        builder.addCase(listBillAddressVendor.fulfilled, (state, action) => {
            state.billAddressVendorListData = action.payload?.message.data || [];
            state.listbilladdressDataloading = false;
        });
        builder.addCase(listBillAddressVendor.rejected, (state) => {
            state.listbilladdressDataloading = false;
            state.billAddressVendorListData = [];
        });
        // BillAddress POST
        builder.addCase(billAddressVendor.pending, (state) => {
            state.billAddressVendorDataLoading = true;
        });
        builder.addCase(billAddressVendor.fulfilled, (state, action) => {
            state.billAddressVendorListData = action.payload?.data; // Update state property name
            state.billAddressVendorDataLoading = false;
        });
        builder.addCase(billAddressVendor.rejected, (state) => {
            state.billAddressVendorDataLoading = false;
            state.billAddressVendorListData = [];
        });
        // BillAddress UPDATE
        builder.addCase(updateBillAddressVendor.pending, (state) => {
            state.billAddressVendorDataLoading = true;
        });
        builder.addCase(updateBillAddressVendor.fulfilled, (state, action) => {
            state.billAddressVendorListData = action.payload?.data; // Update state property name
            state.billAddressVendorDataLoading = false;
        });
        builder.addCase(updateBillAddressVendor.rejected, (state) => {
            state.billAddressVendorDataLoading = false;
            state.billAddressVendorListData = [];
        });
        // BillAddress DELETE
        builder.addCase(deleteBillAddress.pending, (state) => {
            state.deleteBillAddressLoading = true;
        });
        builder.addCase(deleteBillAddress.fulfilled, (state, action) => {
            state.deleteBillAddressLoading = false;
        });
        builder.addCase(deleteBillAddress.rejected, (state) => {
            state.deleteBillAddressLoading = false;
        });
    }
});

const billAddressVendorReducers = billAddressVendorSlice.reducer;
export default billAddressVendorReducers;
